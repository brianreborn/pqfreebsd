import type { DacRule, Policy, Subject } from "./types";

export const DEFAULT_POLICY: Policy = {
  trustedGroup: "lomac-trusted",
  sandboxGroup: "lomac-sandbox",
  trustedMembers: ["green"],
  sandboxMembers: ["dev"],
  defaultRole: "sandbox",
  rootLabel: "lomac/equal(equal-equal)",
  trustedLabel: "lomac/high(low-high)",
  sandboxLabel: "lomac/10[2]",
  ledgerDataset: "zroot/pq/ledger",
  dacMode: "repair",
  hashName: "SHA-256",
  withLomac: true,
  withSeeotheruids: true,
  homesMatchClass: false,
  bootSatisfied: false,
  replicaEnabled: false,
  replicaPeer: "",
};

export const INTERVIEW = [
  {
    key: "withLomac" as const,
    title: "Integrity lattice",
    ask: "Protect OS integrity with mac_lomac(4)? Short proof: sandbox cannot write-up into high OS objects after a low read.",
    kind: "bool" as const,
  },
  {
    key: "withSeeotheruids" as const,
    title: "Orthogonal module",
    ask: "Load mac_seeotheruids(4) (hide other UIDs, exempt GID 0 / wheel)? Do not stack Biba or MLS.",
    kind: "bool" as const,
  },
  {
    key: "trustedMembers" as const,
    title: "Trusted role",
    ask: "Which accounts join lomac-trusted (humans who may start at OS integrity)? Roles are groups, not per-user overlays.",
    kind: "csv" as const,
  },
  {
    key: "sandboxMembers" as const,
    title: "Sandbox role",
    ask: "Which accounts join lomac-sandbox (agents, builders, guests)? New users default here.",
    kind: "csv" as const,
  },
  {
    key: "homesMatchClass" as const,
    title: "Homes",
    ask: "Keep official PLM (/home/.* low)? Overlay homes to match class only if you insist — harder to prove.",
    kind: "invert-bool" as const,
    yesLabel: "Official PLM (homes low)",
    noLabel: "Homes match class",
  },
  {
    key: "ledgerDataset" as const,
    title: "Ledger dataset",
    ask: "ZFS dataset for the Integrity Evidence chain. Must be labeled high before enforce. Rotation appends; rewrite is a bug.",
    kind: "text" as const,
  },
  {
    key: "dacMode" as const,
    title: "A_D morphism",
    ask: "How should discretionary drift be handled? observe logs; repair restores after the syscall; prevent denies the grant (ugidfw) and still repairs existing drift.",
    kind: "dac" as const,
  },
  {
    key: "hashName" as const,
    title: "Chain hash",
    ask: "Grover halves the bits. SHA-256 is 128-bit against Grover; production prefers SHA-512. This workbench hashes SHA-256 so the chain is real and inspectable.",
    kind: "hash" as const,
  },
  {
    key: "bootSatisfied" as const,
    title: "Bootloader gate",
    ask: "Are you sufficiently satisfied that this system is post-quantum hardened to the degree that gives you a sense of security? Only then may the umbrella secure the bootloader (TPM is not this pass), replace the splash name with pqfreebsd, and replace the beastie with the shield — the armor of God. Default no. Do not rebrand a box you do not yet trust.",
    kind: "bool" as const,
  },
  {
    key: "replicaEnabled" as const,
    title: "Off-host IE",
    ask: "Include and enable the ledger replica protocol — a second host that stores and validates the Integrity Evidence? If you are network-stranded and cannot securely transport the chain, that claim degrades. Mediation and local IE do not. Default no: do not claim independent storage you cannot perform.",
    kind: "bool" as const,
  },
  {
    key: "replicaPeer" as const,
    title: "Replica peer",
    ask: "Name of the peer that will store the ledger (hostname). Empty if the replica module is not included. A named peer on a stranded box is a degraded claim, not a silent one.",
    kind: "text" as const,
  },
];

export function defaultRules(): DacRule[] {
  return [
    { id: "ledger", pattern: "^/pq/ledger", owner: "root", group: "wheel", dirMode: 0o700, fileMode: 0o600 },
    { id: "master", pattern: "^/etc/master\\.passwd$", owner: "root", group: "wheel", dirMode: 0o600, fileMode: 0o600 },
    { id: "etc", pattern: "^/etc", owner: "root", group: "wheel", dirMode: 0o755, fileMode: 0o644 },
    { id: "green-home", pattern: "^/home/green", owner: "green", group: "green", dirMode: 0o755, fileMode: 0o644 },
    { id: "dev-home", pattern: "^/home/dev", owner: "dev", group: "dev", dirMode: 0o755, fileMode: 0o644 },
    { id: "home", pattern: "^/home", owner: "root", group: "wheel", dirMode: 0o755, fileMode: 0o644 },
    { id: "varlog", pattern: "^/var/log", owner: "root", group: "wheel", dirMode: 0o755, fileMode: 0o644 },
    { id: "tmp", pattern: "^/tmp", owner: "root", group: "wheel", dirMode: 0o1777, fileMode: 0o666 },
    { id: "usr", pattern: "^/usr", owner: "root", group: "wheel", dirMode: 0o755, fileMode: 0o644 },
    { id: "rootfs", pattern: "^/", owner: "root", group: "wheel", dirMode: 0o755, fileMode: 0o644 },
  ];
}

export function defaultSubjects(policy: Policy): Record<string, Subject> {
  return {
    root: {
      name: "root",
      uid: 0,
      gid: "wheel",
      groups: ["wheel"],
      role: "exempt",
      label: policy.rootLabel,
      effective: "equal",
      base: "equal",
    },
    green: {
      name: "green",
      uid: 1001,
      gid: "green",
      groups: ["wheel", policy.trustedGroup],
      role: "trusted",
      label: policy.trustedLabel,
      effective: 100,
      base: 100,
    },
    dev: {
      name: "dev",
      uid: 1002,
      gid: "dev",
      groups: [policy.sandboxGroup],
      role: "sandbox",
      label: policy.sandboxLabel,
      effective: 10,
      base: 10,
    },
  };
}

export function modeString(mode: number) {
  const special = mode & 0o7000;
  const perms = mode & 0o777;
  const s = perms.toString(8).padStart(3, "0");
  const sticky = special & 0o1000 ? "t" : "";
  return (sticky ? "1" : "0") + s;
}

export function formatMode(mode: number) {
  const kinds = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  const u = kinds[(mode >> 6) & 7];
  const g = kinds[(mode >> 3) & 7];
  const o = kinds[mode & 7];
  const extra = mode & 0o1000 ? "t" : "";
  return extra ? `${u}${g}${o.slice(0, 2)}${extra === "t" ? (o[2] === "x" ? "t" : "T") : o[2]}` : `${u}${g}${o}`;
}
