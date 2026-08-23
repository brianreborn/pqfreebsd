import { applyRule, findDrift, matchRule, wouldDrift } from "./dac";
import { artifacts, catalogHash, snapshotRev } from "./audit";
import { defaultRules, defaultSubjects, formatMode } from "./policy";
import { sha256Hex, shortHash } from "./sha256";
import type { FsNode, LedgerEvent, Op, Policy, ResultKind, Subject, World } from "./types";

const GENESIS = "pqledger-genesis-v0";

function node(path: string, kind: FsNode["kind"], owner: string, group: string, mode: number, label: string, content = ""): FsNode {
  return { path, kind, owner, group, mode, label, content };
}

export function seedNodes(policy: Policy): Record<string, FsNode> {
  const homeLabel = policy.homesMatchClass ? "lomac/high" : "lomac/low";
  const list: FsNode[] = [
    node("/", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/etc", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/etc/login.conf", "file", "root", "wheel", 0o644, "lomac/high", "root:label=lomac/equal(equal-equal)\n"),
    node("/etc/master.passwd", "file", "root", "wheel", 0o600, "lomac/high", "root:*:0:0::0:0:Charlie &:/root:/bin/sh\n"),
    node("/home", "dir", "root", "wheel", 0o755, "lomac/low"),
    node("/home/green", "dir", "green", "green", 0o755, homeLabel),
    node("/home/green/notes", "file", "green", "green", 0o644, "lomac/low", "desktop notes\n"),
    node("/home/dev", "dir", "dev", "dev", 0o755, "lomac/low"),
    node("/home/dev/src", "dir", "dev", "dev", 0o755, "lomac/low"),
    node("/home/dev/src/agent.c", "file", "dev", "dev", 0o644, "lomac/low", "int main(){}\n"),
    node("/tmp", "dir", "root", "wheel", 0o1777, "lomac/equal"),
    node("/var", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/var/log", "dir", "root", "wheel", 0o755, "lomac/equal"),
    node("/var/run", "dir", "root", "wheel", 0o755, "lomac/equal"),
    node("/usr", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/usr/bin", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/usr/local", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/dev", "dir", "root", "wheel", 0o755, "lomac/equal"),
    node("/pq", "dir", "root", "wheel", 0o755, "lomac/high"),
    node("/pq/ledger", "dir", "root", "wheel", 0o700, "lomac/high"),
    node("/pq/ledger/HEAD", "file", "root", "wheel", 0o600, "lomac/high", GENESIS),
  ];
  return Object.fromEntries(list.map((n) => [n.path, n]));
}

export function parentPath(path: string) {
  if (path === "/") return "/";
  const i = path.lastIndexOf("/");
  return i <= 0 ? "/" : path.slice(0, i);
}

export function gradeOf(label: string): number | "equal" {
  if (label.includes("equal")) return "equal";
  if (label.includes("high")) return 100;
  const m = label.match(/lomac\/(\d+)/);
  if (m) return Number(m[1]);
  if (label.includes("low")) return 0;
  return 0;
}

function dominatesWrite(subject: Subject, object: FsNode) {
  if (subject.effective === "equal") return true;
  const og = gradeOf(object.label);
  if (og === "equal") return true;
  if (typeof subject.effective === "number") return subject.effective >= og;
  return true;
}

function dacAllows(subject: Subject, object: FsNode, want: "r" | "w" | "x") {
  if (subject.uid === 0) return true;
  const shift = object.owner === subject.name ? 6 : object.group === subject.gid || subject.groups.includes(object.group) ? 3 : 0;
  const bit = want === "r" ? 4 : want === "w" ? 2 : 1;
  return Boolean((object.mode >> shift) & bit);
}

function capHeld(actor: Subject, path: string) {
  if (path === "/tmp" || path.startsWith("/tmp/")) return true;
  const home = `/home/${actor.name}`;
  if (path === home || path.startsWith(`${home}/`)) return true;
  return false;
}

function iso(clock: number) {
  const d = new Date(Date.UTC(2026, 7, 22, 21, 0, 0) + clock * 1000);
  return d.toISOString().replace(".000", "");
}

export function appendEvent(
  world: World,
  partial: Omit<LedgerEvent, "seq" | "ts" | "prevHash" | "hash">,
): LedgerEvent {
  const prev = world.ledger.length ? world.ledger[world.ledger.length - 1].hash : "0".repeat(64);
  const seq = world.ledger.length;
  const ts = iso(world.clock);
  const preimage = `${prev}|${seq}|${ts}|${partial.op}|${partial.subject}|${partial.object}|${partial.result}|${partial.detail}`;
  const hash = sha256Hex(preimage);
  return { seq, ts, prevHash: prev, hash, ...partial };
}

export function verifyChain(events: LedgerEvent[]): { ok: boolean; at: number | null; reason: string } {
  let prev = "0".repeat(64);
  for (const e of events) {
    if (e.prevHash !== prev) return { ok: false, at: e.seq, reason: `prevHash break at seq ${e.seq}` };
    const preimage = `${e.prevHash}|${e.seq}|${e.ts}|${e.op}|${e.subject}|${e.object}|${e.result}|${e.detail}`;
    const expect = sha256Hex(preimage);
    if (e.hash !== expect) return { ok: false, at: e.seq, reason: `hash mismatch at seq ${e.seq}` };
    prev = e.hash;
  }
  return { ok: true, at: null, reason: "chain intact" };
}

export function createWorld(policy: Policy): World {
  const subjects = defaultSubjects(policy);
  const rules = defaultRules();
  const nodes = seedNodes(policy);
  const world: World = {
    policy,
    subjects,
    actor: "root",
    nodes,
    rules,
    ledger: [],
    snaps: [],
    enforce: false,
    labeled: false,
    chainOk: true,
    clock: 0,
    revs: [],
    appliedCatalog: "",
    applied: [],
    stranded: false,
    replicaOk: false,
  };
  const genesis = appendEvent(world, {
    op: "label",
    subject: "root",
    object: policy.ledgerDataset,
    result: "info",
    detail: `genesis ${GENESIS}; hash=${policy.hashName}; A_M staged, enabled=0`,
  });
  world.ledger = [genesis];
  world.clock = 1;
  const rev0 = snapshotRev(world, genesis.ts, null);
  world.revs = [rev0];
  world.applied = artifacts(world);
  world.appliedCatalog = catalogHash(world.applied);
  return world;
}

export type Action =
  | { type: "login"; name: string }
  | { type: "cap_enter" }
  | { type: "read"; path: string }
  | { type: "write"; path: string; content?: string }
  | { type: "create"; path: string; kind: "file" | "dir" }
  | { type: "unlink"; path: string }
  | { type: "chmod"; path: string; mode: number }
  | { type: "chown"; path: string; owner: string; group: string }
  | { type: "repair"; path?: string }
  | { type: "establish" }
  | { type: "label" }
  | { type: "enforce" }
  | { type: "unenforce" }
  | { type: "snapshot"; when: "pre" | "post" }
  | { type: "tamper"; seq: number }
  | { type: "verify" }
  | { type: "reset"; policy: Policy }
  | { type: "setPolicy"; policy: Policy }
  | { type: "addRule"; rule: World["rules"][number] }
  | { type: "removeRule"; id: string }
  | { type: "propagate" }
  | { type: "audit" }
  | { type: "replicate" }
  | { type: "strand"; on: boolean };

export type Step = {
  world: World;
  event: LedgerEvent | null;
  message: string;
  demoted: boolean;
};

function cloneWorld(w: World): World {
  return {
    ...w,
    policy: { ...w.policy },
    subjects: Object.fromEntries(Object.entries(w.subjects).map(([k, v]) => [k, { ...v }])),
    nodes: Object.fromEntries(Object.entries(w.nodes).map(([k, v]) => [k, { ...v }])),
    rules: w.rules.map((r) => ({ ...r })),
    ledger: w.ledger.map((e) => ({ ...e })),
    snaps: w.snaps.map((s) => ({ ...s })),
    revs: (w.revs ?? []).map((r) => ({ ...r })),
    applied: (w.applied ?? []).map((a) => ({ ...a })),
  };
}

function push(world: World, partial: Omit<LedgerEvent, "seq" | "ts" | "prevHash" | "hash">, extra: Partial<World> = {}): Step {
  world.clock += 1;
  const event = appendEvent(world, partial);
  world.ledger = [...world.ledger, event];
  Object.assign(world, extra);
  const v = verifyChain(world.ledger);
  world.chainOk = v.ok;
  return { world, event, message: partial.detail, demoted: false };
}

function deny(world: World, op: Op, object: string, detail: string): Step {
  return push(world, { op, subject: world.actor, object, result: "deny", detail });
}

export function reduce(prev: World, action: Action): Step {
  if (action.type === "reset") {
    const world = createWorld(action.policy);
    return { world, event: world.ledger[0], message: "world reset; genesis written", demoted: false };
  }
  if (action.type === "setPolicy") {
    const world = cloneWorld(prev);
    world.policy = action.policy;
    world.subjects = defaultSubjects(action.policy);
    return push(world, {
      op: "label",
      subject: "root",
      object: "POLICY",
      result: "info",
      detail: `policy restated; ledger=${action.policy.ledgerDataset}; dac=${action.policy.dacMode}`,
    });
  }
  if (action.type === "addRule") {
    const world = cloneWorld(prev);
    world.rules = [action.rule, ...world.rules.filter((r) => r.id !== action.rule.id)];
    return push(world, {
      op: "establish",
      subject: world.actor,
      object: action.rule.pattern,
      result: "info",
      detail: `DAC rule ${action.rule.id} first-match ${action.rule.pattern} → ${action.rule.owner}:${action.rule.group}`,
    });
  }
  if (action.type === "removeRule") {
    const world = cloneWorld(prev);
    world.rules = world.rules.filter((r) => r.id !== action.id);
    return push(world, {
      op: "establish",
      subject: world.actor,
      object: action.id,
      result: "info",
      detail: `DAC rule ${action.id} removed; combinator still first-match`,
    });
  }
  if (action.type === "propagate") {
    const world = cloneWorld(prev);
    const live = artifacts(world);
    const last = world.revs[world.revs.length - 1] ?? null;
    world.clock += 1;
    const ts = iso(world.clock);
    const rev = snapshotRev(world, ts, last);
    world.revs = [...world.revs, rev];
    world.applied = live;
    world.appliedCatalog = rev.catalogHash;
    for (const node of Object.values(world.nodes)) {
      const rule = matchRule(world.rules, node.path);
      if (rule) world.nodes[node.path] = applyRule(node, rule);
    }
    return push(world, {
      op: "propagate",
      subject: world.actor,
      object: "POLICY",
      result: rev.fails ? "info" : "allow",
      detail: `policy rev ${rev.seq} catalog=${rev.catalogHash.slice(0, 12)} fails=${rev.fails} warns=${rev.warns}`,
    });
  }
  if (action.type === "audit") {
    const world = cloneWorld(prev);
    const live = artifacts(world);
    const catalog = catalogHash(live);
    const draft = world.appliedCatalog !== catalog;
    const last = world.revs[world.revs.length - 1];
    const fails = snapshotRev(world, iso(world.clock + 1), last ?? null).fails;
    return push(world, {
      op: "audit",
      subject: world.actor,
      object: "POLICY",
      result: !draft && fails === 0 && world.chainOk ? "allow" : "info",
      detail: draft
        ? `audit: draft ≠ applied (${catalog.slice(0, 12)} vs ${(world.appliedCatalog || "none").slice(0, 12)})`
        : `audit: catalog=${catalog.slice(0, 12)} fails=${fails} revs=${world.revs.length} chain=${world.chainOk ? "ok" : "BROKEN"}`,
    });
  }
  if (action.type === "strand") {
    const world = cloneWorld(prev);
    world.stranded = action.on;
    if (action.on) world.replicaOk = false;
    return push(world, {
      op: "strand",
      subject: world.actor,
      object: world.policy.replicaPeer || "net",
      result: "info",
      detail: action.on
        ? "network stranded — off-host IE cannot be transported; other claims unchanged"
        : "network restored — replica protocol may run if included and enabled",
    });
  }
  if (action.type === "replicate") {
    const world = cloneWorld(prev);
    const p = world.policy;
    if (!p.replicaEnabled) {
      return deny(
        world,
        "replicate",
        p.replicaPeer || "peer",
        "replica module not included — no off-host IE claim to discharge (T14 silent)",
      );
    }
    if (world.stranded) {
      return deny(
        world,
        "replicate",
        p.replicaPeer || "peer",
        "stranded — cannot securely transport the ledger; local IE and mediation are not thereby false",
      );
    }
    if (!p.replicaPeer.trim()) {
      return deny(world, "replicate", "peer", "replica enabled but no peer named");
    }
    world.replicaOk = true;
    const head = world.ledger.length ? world.ledger[world.ledger.length - 1].hash : "";
    return push(world, {
      op: "replicate",
      subject: world.actor,
      object: p.replicaPeer,
      result: "allow",
      detail: `peer ${p.replicaPeer} stored HEAD ${head.slice(0, 12)}; independent storage confirmed`,
    });
  }

  const world = cloneWorld(prev);
  const actor = world.subjects[world.actor];

  if (action.type === "login") {
    if (!world.subjects[action.name]) {
      return deny(world, "login", action.name, `no such subject ${action.name}`);
    }
    world.actor = action.name;
    const s = world.subjects[action.name];
    s.effective = s.base;
    if (world.policy.withCapsicum && s.role === "sandbox") {
      s.capabilityMode = true;
    }
    return push(world, {
      op: "login",
      subject: action.name,
      object: "login.conf",
      result: "info",
      detail: s.capabilityMode
        ? `lambda(s)=${s.label}; cap_enter at login (pqcap-enter). ambient namespace dropped`
        : `lambda(s)=${s.label}; labels attach at login, not in the editing shell`,
    });
  }

  if (action.type === "cap_enter") {
    if (!world.policy.withCapsicum) {
      return deny(world, "login", "cap_enter", "Capsicum conjunct silent (withCapsicum=no). Lattice is not thereby false.");
    }
    actor.capabilityMode = true;
    return push(world, {
      op: "login",
      subject: actor.name,
      object: "cap_enter",
      result: "info",
      detail: "caph_limit_stdio + caph_enter. Casper later. Independent of LOMAC.",
    });
  }

  if (action.type === "snapshot") {
    const name = `zroot@pqfreebsd-${action.when}-${iso(world.clock).replace(/[-:]/g, "")}`;
    world.snaps = [...world.snaps, { name, when: action.when, ts: iso(world.clock) }];
    return push(world, {
      op: "snapshot",
      subject: world.actor,
      object: name,
      result: "info",
      detail: `zfs snapshot -r (filesystems + zvols); no bectl; checkpoint not taken`,
    });
  }

  if (action.type === "label") {
    world.labeled = true;
    return push(world, {
      op: "label",
      subject: world.actor,
      object: "/",
      result: "info",
      detail: "setfmac probe /tmp ok; setfsmac -x overlays then PLM; ledger dataset high",
    });
  }

  if (action.type === "enforce") {
    if (!world.labeled) {
      return deny(world, "enforce", "security.mac.lomac.enabled", "empty interpretation: label before enforce (praxis)");
    }
    world.enforce = true;
    return push(world, {
      op: "enforce",
      subject: world.actor,
      object: "security.mac.lomac.enabled",
      result: "info",
      detail: "enabled=1; keep a console; sysctl …=0 is the off switch",
    });
  }

  if (action.type === "unenforce") {
    world.enforce = false;
    return push(world, {
      op: "unenforce",
      subject: world.actor,
      object: "security.mac.lomac.enabled",
      result: "info",
      detail: "enabled=0; xattrs remain; A_M is the identity without the kld",
    });
  }

  if (action.type === "verify") {
    const v = verifyChain(world.ledger);
    world.chainOk = v.ok;
    return push(world, {
      op: "verify",
      subject: world.actor,
      object: "/pq/ledger",
      result: v.ok ? "info" : "broken",
      detail: v.reason,
    });
  }

  if (action.type === "tamper") {
    const target = world.ledger.find((e) => e.seq === action.seq);
    if (!target) return deny(world, "tamper", String(action.seq), "no such record");
    if (world.enforce && !dominatesWrite(actor, world.nodes["/pq/ledger"])) {
      return deny(world, "tamper", "/pq/ledger", "low-integrity cannot overwrite high-integrity ledger");
    }
    world.ledger = world.ledger.map((e) =>
      e.seq === action.seq ? { ...e, detail: e.detail + " [tampered]" } : e,
    );
    const v = verifyChain(world.ledger);
    world.chainOk = v.ok;
    return push(world, {
      op: "tamper",
      subject: world.actor,
      object: `/pq/ledger#${action.seq}`,
      result: "broken",
      detail: `rewrote seq ${action.seq} without restating the hash; ${v.reason}`,
    });
  }

  if (action.type === "establish") {
    let n = 0;
    for (const path of Object.keys(world.nodes)) {
      const rule = matchRule(world.rules, path);
      if (!rule) continue;
      world.nodes[path] = applyRule(world.nodes[path], rule);
      n += 1;
    }
    return push(world, {
      op: "establish",
      subject: world.actor,
      object: "A_D",
      result: "info",
      detail: `oneestablish: ${n} objects inherited first-match spec`,
    });
  }

  if (action.type === "repair") {
    const drift = findDrift(world.nodes, world.rules).filter((d) => !action.path || d.path === action.path);
    const paths = [...new Set(drift.map((d) => d.path))];
    for (const path of paths) {
      const rule = matchRule(world.rules, path);
      if (rule) world.nodes[path] = applyRule(world.nodes[path], rule);
    }
    return push(world, {
      op: "repair",
      subject: world.actor,
      object: action.path ?? "A_D",
      result: paths.length ? "repair" : "info",
      detail: paths.length ? `onerepair: restored ${paths.join(", ")}` : "testdrift: no drift",
    });
  }

  const path =
    action.type === "read" ||
    action.type === "write" ||
    action.type === "create" ||
    action.type === "unlink" ||
    action.type === "chmod" ||
    action.type === "chown"
      ? action.path
      : "";

  if (actor.capabilityMode && path && !capHeld(actor, path)) {
    return deny(
      world,
      action.type,
      path,
      `capability mode: cannot open ${path} (no fd). LOMAC is a different predicate.`,
    );
  }

  if (action.type === "create") {
    if (world.nodes[path]) return deny(world, "create", path, "EEXIST");
    const parent = world.nodes[parentPath(path)];
    if (!parent) return deny(world, "create", path, "ENOENT parent");
    if (world.enforce && !dominatesWrite(actor, parent)) {
      return deny(world, "create", path, `low-integrity cannot create under high-integrity ${parent.path}`);
    }
    if (!dacAllows(actor, parent, "w")) return deny(world, "create", path, "DAC: parent not writable");
    const rule = matchRule(world.rules, path);
    const born: FsNode = {
      path,
      kind: action.kind,
      owner: actor.name,
      group: actor.gid,
      mode: action.kind === "dir" ? 0o755 : 0o644,
      label: parent.label,
      content: "",
    };
    const established = rule ? applyRule(born, rule) : born;
    world.nodes[path] = established;
    const detail = rule
      ? `established by ${rule.id}: ${established.owner}:${established.group} ${formatMode(established.mode)}`
      : `created unlabeled by spec; owner ${actor.name}`;
    const step = push(world, { op: "create", subject: actor.name, object: path, result: "allow", detail });
    return maybeDemote(step, actor, parent, "write");
  }

  const object = world.nodes[path];
  if (!object) return deny(world, action.type as Op, path, "ENOENT");

  if (action.type === "read") {
    if (!dacAllows(actor, object, "r")) return deny(world, "read", path, "DAC: EACCES");
    const step = push(world, {
      op: "read",
      subject: actor.name,
      object: path,
      result: "allow",
      detail: `read ${path} (${object.label})`,
    });
    return maybeDemote(step, actor, object, "read");
  }

  if (action.type === "write") {
    if (world.enforce && !dominatesWrite(actor, object)) {
      return deny(world, "write", path, `low-integrity cannot overwrite high-integrity ${path}`);
    }
    if (!dacAllows(actor, object, "w")) return deny(world, "write", path, "DAC: EACCES");
    world.nodes[path] = { ...object, content: action.content ?? object.content + "written\n" };
    const step = push(world, {
      op: "write",
      subject: actor.name,
      object: path,
      result: "allow",
      detail: `write ${path}`,
    });
    return maybeDemote(step, actor, object, "write");
  }

  if (action.type === "unlink") {
    if (path === "/" || path === "/pq/ledger") return deny(world, "unlink", path, "EBUSY");
    const parent = world.nodes[parentPath(path)];
    if (world.enforce && parent && !dominatesWrite(actor, parent)) {
      return deny(world, "unlink", path, `low-integrity cannot unlink under high-integrity parent`);
    }
    if (parent && !dacAllows(actor, parent, "w")) return deny(world, "unlink", path, "DAC: parent not writable");
    delete world.nodes[path];
    return push(world, { op: "unlink", subject: actor.name, object: path, result: "allow", detail: `unlinked ${path}` });
  }

  if (action.type === "chmod" || action.type === "chown") {
    const next =
      action.type === "chmod"
        ? { mode: action.mode }
        : { owner: action.owner, group: action.group };
    if (world.enforce && !dominatesWrite(actor, object)) {
      return deny(world, action.type, path, `low-integrity cannot restate discretionary bits on high-integrity ${path}`);
    }
    const isOwner = actor.name === object.owner || actor.uid === 0;
    if (!isOwner) return deny(world, action.type, path, "DAC: not owner");
    const rule = matchRule(world.rules, path);
    if (rule && world.policy.dacMode === "prevent" && wouldDrift(object, rule, next)) {
      return deny(
        world,
        action.type,
        path,
        `ugidfw/prevent: grant would drift from ${rule.id} (${rule.owner}:${rule.group} ${formatMode(rule.fileMode)})`,
      );
    }
    world.nodes[path] = { ...object, ...next };
    const after = world.nodes[path];
    const detail =
      action.type === "chmod"
        ? `chmod ${formatMode(action.mode)} ${path}`
        : `chown ${action.owner}:${action.group} ${path}`;
    let step = push(world, { op: action.type, subject: actor.name, object: path, result: "allow", detail });
    if (rule && world.policy.dacMode === "repair" && wouldDrift(object, rule, next)) {
      world.nodes[path] = applyRule(after, rule);
      step = push(world, {
        op: "repair",
        subject: "pqdac",
        object: path,
        result: "repair",
        detail: `repair morphism restored ${rule.id} (${after.owner}:${after.group} ${formatMode(after.mode)} → ${rule.owner}:${rule.group} ${formatMode(intended(rule, after.kind))})`,
      });
    }
    return step;
  }

  return { world: prev, event: null, message: "no-op", demoted: false };
}

function intended(rule: { dirMode: number; fileMode: number }, kind: FsNode["kind"]) {
  return kind === "dir" ? rule.dirMode : rule.fileMode;
}

function maybeDemote(step: Step, actor: Subject, object: FsNode, kind: "read" | "write"): Step {
  if (!step.world.enforce) return step;
  if (actor.effective === "equal") return step;
  const og = gradeOf(object.label);
  if (og === "equal") return step;
  if (kind === "read" && typeof actor.effective === "number" && typeof og === "number" && og < actor.effective) {
    const s = step.world.subjects[actor.name];
    s.effective = og;
    step.demoted = true;
    step.message += `; dropped to low-integrity after reading ${object.path}`;
  }
  return step;
}

export function childrenOf(nodes: Record<string, FsNode>, dir: string) {
  return Object.values(nodes)
    .filter((n) => n.path !== dir && parentPath(n.path) === dir)
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function headHash(world: World) {
  const last = world.ledger[world.ledger.length - 1];
  return last ? shortHash(last.hash, 16) : "—";
}

export function resultColor(kind: ResultKind) {
  if (kind === "deny" || kind === "broken") return "text-deny";
  if (kind === "repair") return "text-warn";
  if (kind === "allow") return "text-ok";
  return "text-muted";
}
