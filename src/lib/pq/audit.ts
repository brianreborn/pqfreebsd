import { findDrift } from "./dac";
import { dacContexts, policyFile, suiteFile } from "./export";
import { formatMode } from "./policy";
import { sha256Hex, shortHash } from "./sha256";
import type { Artifact, Policy, PolicyRev, World } from "./types";

export type Check = {
  id: string;
  layer: string;
  ok: boolean;
  severity: "fail" | "warn";
  title: string;
  detail: string;
};

export type KvDelta = {
  key: string;
  from: string | null;
  to: string | null;
};

export type FileDelta = {
  path: string;
  status: "same" | "added" | "removed" | "changed";
  hashFrom?: string;
  hashTo?: string;
  kv: KvDelta[];
};

export function ugidfwRules(world: World) {
  if (world.policy.dacMode !== "prevent") {
    return `# ugidfw not generated — DAC_MODE=${world.policy.dacMode}\n# empty ruleset is allow-all; do not kldload mac_bsdextended without a spec\n`;
  }
  const lines = [
    "# generated from dac.contexts. empty = allow-all. this file is the proof it is not empty.",
    `# first-match combinator, same as setfsmac. DAC_MODE=prevent`,
  ];
  for (const r of world.rules) {
    lines.push(`# ${r.id} ${r.pattern} → ${r.owner}:${r.group} ${formatMode(r.dirMode)}/${formatMode(r.fileMode)}`);
    lines.push(`add subject not uid ${r.owner} object ${r.pattern} mode n`);
  }
  return lines.join("\n") + "\n";
}

export function loginFragment(policy: Policy) {
  return `# login.conf fragment — labels attach at login, not in the editing shell
${policy.trustedGroup}:\\
	:label=${policy.trustedLabel}:\\
	:tc=default:
${policy.sandboxGroup}:\\
	:label=${policy.sandboxLabel}:\\
	:tc=default:
root:\\
	:label=${policy.rootLabel}:\\
	:tc=default:
`;
}

export function macOverlay(policy: Policy) {
  return `# setfsmac overlay — precedes official PLM because first-match wins
/pq/ledger	lomac/high
${policy.ledgerDataset.replace(/^[^/]+\//, "/")}	lomac/high
`;
}

export function artifacts(world: World): Artifact[] {
  const list: Artifact[] = [
    { path: "POLICY", body: policyFile(world.policy) },
    { path: "SUITE", body: suiteFile(world.policy) },
    { path: "dac.contexts", body: dacContexts(world) },
    { path: "ugidfw.rules", body: ugidfwRules(world) },
    { path: "login.conf.fragment", body: loginFragment(world.policy) },
    { path: "mac.conf.overlay", body: macOverlay(world.policy) },
  ];
  if (world.policy.bootSatisfied) {
    list.push({
      path: "boot/loader.conf.local",
      body: `loader_color="YES"\nloader_logo="pqfreebsd"\n# TPM not this pass\n`,
    });
  }
  return list;
}

export function catalogHash(arts: Artifact[]) {
  return sha256Hex(arts.map((a) => `${a.path}:${sha256Hex(a.body)}`).join("|"));
}

function parseKv(body: string) {
  const map = new Map<string, string>();
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    map.set(t.slice(0, i), t.slice(i + 1));
  }
  return map;
}

function kvDelta(fromBody: string, toBody: string): KvDelta[] {
  const a = parseKv(fromBody);
  const b = parseKv(toBody);
  const keys = new Set([...a.keys(), ...b.keys()]);
  const out: KvDelta[] = [];
  for (const key of [...keys].sort()) {
    const from = a.get(key) ?? null;
    const to = b.get(key) ?? null;
    if (from !== to) out.push({ key, from, to });
  }
  return out;
}

export function diffArtifacts(from: Artifact[], to: Artifact[]): FileDelta[] {
  const a = new Map(from.map((x) => [x.path, x]));
  const b = new Map(to.map((x) => [x.path, x]));
  const paths = new Set([...a.keys(), ...b.keys()]);
  const out: FileDelta[] = [];
  for (const path of [...paths].sort()) {
    const left = a.get(path);
    const right = b.get(path);
    if (left && !right) {
      out.push({ path, status: "removed", hashFrom: sha256Hex(left.body), kv: kvDelta(left.body, "") });
      continue;
    }
    if (!left && right) {
      out.push({ path, status: "added", hashTo: sha256Hex(right.body), kv: kvDelta("", right.body) });
      continue;
    }
    if (!left || !right) continue;
    const ha = sha256Hex(left.body);
    const hb = sha256Hex(right.body);
    if (ha === hb) {
      out.push({ path, status: "same", hashFrom: ha, hashTo: hb, kv: [] });
    } else {
      out.push({
        path,
        status: "changed",
        hashFrom: ha,
        hashTo: hb,
        kv: kvDelta(left.body, right.body),
      });
    }
  }
  return out;
}

export function consistency(world: World): Check[] {
  const p = world.policy;
  const ledger = world.nodes["/pq/ledger"];
  const drift = findDrift(world.nodes, world.rules);
  const trusted = new Set(p.trustedMembers);
  const sandbox = new Set(p.sandboxMembers);
  const overlap = p.trustedMembers.filter((m) => sandbox.has(m));
  const missing = [...trusted, ...sandbox].filter((m) => !world.subjects[m] && m !== "root");
  const ledgerRule = world.rules.find((r) => r.id === "ledger");
  const homeIdx = world.rules.findIndex((r) => r.id === "home");
  const greenIdx = world.rules.findIndex((r) => r.id === "green-home");
  const checks: Check[] = [
    {
      id: "lomac-root",
      layer: "A_M",
      ok: !p.withLomac || p.rootLabel.includes("equal"),
      severity: "fail",
      title: "Root exemption matches POLICY",
      detail: p.withLomac
        ? `root ${p.rootLabel} — equal is exemption, not containment (mac(9))`
        : "LOMAC not composed",
    },
    {
      id: "roles-disjoint",
      layer: "roles",
      ok: overlap.length === 0,
      severity: "fail",
      title: "Trusted and sandbox members are disjoint",
      detail: overlap.length ? `overlap: ${overlap.join(", ")}` : "no overlap",
    },
    {
      id: "subjects-exist",
      layer: "roles",
      ok: missing.length === 0,
      severity: "fail",
      title: "Named members exist as subjects",
      detail: missing.length ? `missing: ${missing.join(", ")}` : "all named accounts present",
    },
    {
      id: "ledger-high",
      layer: "ledger",
      ok: Boolean(ledger && ledger.label.includes("high")),
      severity: "fail",
      title: "Ledger dataset labeled high",
      detail: ledger ? ` /pq/ledger ${ledger.label}` : "ledger vnode missing",
    },
    {
      id: "ledger-dac",
      layer: "A_D",
      ok: Boolean(ledgerRule && ledgerRule.owner === "root" && ledgerRule.dirMode === 0o700),
      severity: "fail",
      title: "DAC spec covers the ledger",
      detail: ledgerRule ? `${ledgerRule.pattern} ${ledgerRule.owner} ${formatMode(ledgerRule.dirMode)}` : "no ledger rule",
    },
    {
      id: "first-match-order",
      layer: "A_D",
      ok: greenIdx < 0 || homeIdx < 0 || greenIdx < homeIdx,
      severity: "fail",
      title: "Specific DAC rules precede general /home",
      detail: "first-match is not a join; /home before /home/green is a hole",
    },
    {
      id: "ugidfw",
      layer: "A_D",
      ok: p.dacMode !== "prevent" || world.rules.length > 0,
      severity: "fail",
      title: "prevent mode is not an empty ugidfw",
      detail: p.dacMode === "prevent" ? `${world.rules.length} generated rules` : `mode ${p.dacMode}; module not claimed`,
    },
    {
      id: "suite-lomac",
      layer: "suite",
      ok: suiteFile(p).includes(`WITH_LOMAC=${p.withLomac ? "YES" : "NO"}`),
      severity: "fail",
      title: "SUITE agrees with POLICY on LOMAC",
      detail: "conjunction of files, not a product of proofs",
    },
    {
      id: "boot-gate",
      layer: "boot",
      ok: p.bootSatisfied || artifacts(world).every((a) => a.path !== "boot/loader.conf.local"),
      severity: "fail",
      title: "Splash artifacts only if attested",
      detail: p.bootSatisfied ? "BOOT_SATISFIED=YES; oneboot offered" : "beastie stays",
    },
    {
      id: "homes-label",
      layer: "A_M",
      ok: p.homesMatchClass || (world.nodes["/home/green"]?.label.includes("low") ?? true),
      severity: "warn",
      title: "Home labels match the homes combinator",
      detail: p.homesMatchClass ? "homes match class — harder to prove" : "official PLM /home/.* low",
    },
    {
      id: "dac-drift",
      layer: "A_D",
      ok: drift.length === 0,
      severity: "warn",
      title: "Live tree matches DAC spec",
      detail: drift.length ? `${drift.length} drifted objects — repair or prevent` : "no drift",
    },
    {
      id: "chain",
      layer: "ledger",
      ok: world.chainOk,
      severity: "fail",
      title: "Integrity Evidence chain verifies",
      detail: world.chainOk ? "chain intact" : "chain BROKEN",
    },
    {
      id: "hash-family",
      layer: "T11",
      ok: p.hashName === "SHA-512",
      severity: "warn",
      title: "Production hash is SHA-512",
      detail: `${p.hashName} — Grover halves the bits; workbench may show SHA-256`,
    },
  ];
  return checks;
}

export function snapshotRev(world: World, ts: string, prev: PolicyRev | null): PolicyRev {
  const arts = artifacts(world);
  const checks = consistency(world);
  return {
    seq: prev ? prev.seq + 1 : 0,
    ts,
    policyHash: sha256Hex(policyFile(world.policy)),
    catalogHash: catalogHash(arts),
    prevCatalog: prev ? prev.catalogHash : "0".repeat(64),
    fails: checks.filter((c) => !c.ok && c.severity === "fail").length,
    warns: checks.filter((c) => !c.ok && c.severity === "warn").length,
  };
}

export function revChainOk(revs: PolicyRev[]) {
  let prev = "0".repeat(64);
  for (const r of revs) {
    if (r.prevCatalog !== prev) return { ok: false, at: r.seq, reason: `rev ${r.seq} prevCatalog break` };
    prev = r.catalogHash;
  }
  return { ok: true, at: null as number | null, reason: `${revs.length} policy revisions chained` };
}

export function audit(world: World) {
  const live = artifacts(world);
  const liveCatalog = catalogHash(live);
  const applied = world.applied ?? [];
  const revs = world.revs ?? [];
  const checks = consistency(world);
  const deltas = diffArtifacts(applied, live);
  const draft = applied.length > 0 && liveCatalog !== world.appliedCatalog;
  const revsCheck = revChainOk(revs);
  const fails = checks.filter((c) => !c.ok && c.severity === "fail");
  const warns = checks.filter((c) => !c.ok && c.severity === "warn");
  const ok = fails.length === 0 && revsCheck.ok && world.chainOk && !draft && revs.length > 0;
  return {
    checks,
    fails,
    warns,
    deltas,
    draft,
    live,
    liveCatalog,
    appliedCatalog: world.appliedCatalog ?? "",
    revs,
    revsCheck,
    ok,
    summary: ok
      ? "audit successful — policies consistent, revisions chained, live matches applied"
      : draft
        ? "draft differs from applied — propagate to take a revision"
        : fails.length
          ? `${fails.length} consistency fail(s)`
          : !revsCheck.ok
            ? revsCheck.reason
            : "audit incomplete",
  };
}

export { shortHash };
