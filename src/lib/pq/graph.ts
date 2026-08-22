export type SkillKind = "paper" | "parent" | "sibling" | "here" | "pending";

export type SkillNode = {
  id: string;
  label: string;
  subtitle: string;
  kind: SkillKind;
  href: string;
  x: number;
  y: number;
  delay: number;
};

export type SkillEdge = {
  from: string;
  to: string;
};

/** Derivation graph. Positions in a 960×680 viewBox. */
export const SKILL_NODES: SkillNode[] = [
  {
    id: "pqac",
    label: "pqac(7)",
    subtitle: "T1–T5 mediation",
    kind: "paper",
    href: "/paper",
    x: 382,
    y: 16,
    delay: 0,
  },
  {
    id: "mac",
    label: "freebsd-mac",
    subtitle: "zfs snapshot -r",
    kind: "parent",
    href: "/issues",
    x: 382,
    y: 108,
    delay: 360,
  },
  {
    id: "lomac",
    label: "mac-lomac",
    subtitle: "A_M integrity",
    kind: "parent",
    href: "/lattice",
    x: 72,
    y: 200,
    delay: 640,
  },
  {
    id: "generic",
    label: "mac-generic",
    subtitle: "seeotheruids",
    kind: "parent",
    href: "/issues",
    x: 382,
    y: 200,
    delay: 800,
  },
  {
    id: "headroom",
    label: "max-headroom",
    subtitle: "agents in sandbox",
    kind: "sibling",
    href: "/paper",
    x: 692,
    y: 200,
    delay: 960,
  },
  {
    id: "pqfreebsd",
    label: "pqfreebsd",
    subtitle: "this suite",
    kind: "here",
    href: "/interview",
    x: 382,
    y: 308,
    delay: 1280,
  },
  {
    id: "pqledger",
    label: "pqledger",
    subtitle: "Integrity Evidence",
    kind: "here",
    href: "/ledger",
    x: 72,
    y: 416,
    delay: 1600,
  },
  {
    id: "pqdac",
    label: "pqdac",
    subtitle: "establish / repair",
    kind: "here",
    href: "/dac",
    x: 382,
    y: 416,
    delay: 1760,
  },
  {
    id: "pqaudit",
    label: "pqaudit",
    subtitle: "consistency · revs",
    kind: "here",
    href: "/audit",
    x: 692,
    y: 308,
    delay: 1960,
  },
  {
    id: "port",
    label: "sysutils/pqfreebsd",
    subtitle: "port · LLM attested",
    kind: "here",
    href: "/port",
    x: 72,
    y: 308,
    delay: 2100,
  },
  {
    id: "pqconfirm",
    label: "pqconfirm",
    subtitle: "payload integrity",
    kind: "pending",
    href: "/confirm",
    x: 692,
    y: 416,
    delay: 99999,
  },
  {
    id: "pqzfs",
    label: "pqzfs",
    subtitle: "store + send auth",
    kind: "pending",
    href: "/code",
    x: 72,
    y: 540,
    delay: 99999,
  },
  {
    id: "pqcode",
    label: "pqcode",
    subtitle: "sign the bits run",
    kind: "pending",
    href: "/code",
    x: 382,
    y: 540,
    delay: 99999,
  },
  {
    id: "sebsd",
    label: "mac-sebsd",
    subtitle: "FLASK / TE",
    kind: "pending",
    href: "/code",
    x: 692,
    y: 540,
    delay: 99999,
  },
  {
    id: "pqboot",
    label: "pqboot",
    subtitle: "splash · no TPM",
    kind: "pending",
    href: "/boot",
    x: 382,
    y: 652,
    delay: 99999,
  },
];

export const SKILL_EDGES: SkillEdge[] = [
  { from: "pqac", to: "mac" },
  { from: "mac", to: "lomac" },
  { from: "mac", to: "generic" },
  { from: "mac", to: "headroom" },
  { from: "lomac", to: "pqfreebsd" },
  { from: "generic", to: "pqfreebsd" },
  { from: "headroom", to: "pqfreebsd" },
  { from: "pqfreebsd", to: "pqledger" },
  { from: "pqfreebsd", to: "pqdac" },
  { from: "pqfreebsd", to: "pqaudit" },
  { from: "pqfreebsd", to: "port" },
  { from: "pqfreebsd", to: "pqconfirm" },
  { from: "pqfreebsd", to: "pqzfs" },
  { from: "pqfreebsd", to: "pqcode" },
  { from: "pqfreebsd", to: "sebsd" },
  { from: "pqfreebsd", to: "pqboot" },
];

export const CREATION_ORDER = SKILL_NODES.filter((n) => n.kind !== "pending");
export const HELD_ORDER = SKILL_NODES.filter((n) => n.kind === "pending");
