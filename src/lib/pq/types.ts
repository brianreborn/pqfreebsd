export type Role = "exempt" | "trusted" | "sandbox";
export type DacMode = "observe" | "repair" | "prevent";
export type Op =
  | "read"
  | "write"
  | "create"
  | "unlink"
  | "chmod"
  | "chown"
  | "repair"
  | "establish"
  | "label"
  | "enforce"
  | "unenforce"
  | "snapshot"
  | "tamper"
  | "verify"
  | "login"
  | "propagate"
  | "audit";

export type ResultKind = "allow" | "deny" | "repair" | "info" | "broken";

export type Grade = number | "equal";

export type Subject = {
  name: string;
  uid: number;
  gid: string;
  groups: string[];
  role: Role;
  label: string;
  effective: Grade;
  base: Grade;
};

export type FsNode = {
  path: string;
  kind: "dir" | "file";
  owner: string;
  group: string;
  mode: number;
  label: string;
  content: string;
};

export type DacRule = {
  id: string;
  pattern: string;
  owner: string;
  group: string;
  dirMode: number;
  fileMode: number;
};

export type LedgerEvent = {
  seq: number;
  ts: string;
  op: Op;
  subject: string;
  object: string;
  result: ResultKind;
  detail: string;
  prevHash: string;
  hash: string;
};

export type Drift = {
  path: string;
  field: "owner" | "group" | "mode";
  intended: string;
  actual: string;
  ruleId: string;
};

export type Policy = {
  trustedGroup: string;
  sandboxGroup: string;
  trustedMembers: string[];
  sandboxMembers: string[];
  defaultRole: Role;
  rootLabel: string;
  trustedLabel: string;
  sandboxLabel: string;
  ledgerDataset: string;
  dacMode: DacMode;
  hashName: "SHA-256" | "SHA-512";
  withLomac: boolean;
  withSeeotheruids: boolean;
  homesMatchClass: boolean;
  bootSatisfied: boolean;
};

export type PolicyRev = {
  seq: number;
  ts: string;
  policyHash: string;
  catalogHash: string;
  prevCatalog: string;
  fails: number;
  warns: number;
};

export type Artifact = {
  path: string;
  body: string;
};

export type Snap = {
  name: string;
  when: "pre" | "post";
  ts: string;
};

export type World = {
  policy: Policy;
  subjects: Record<string, Subject>;
  actor: string;
  nodes: Record<string, FsNode>;
  rules: DacRule[];
  ledger: LedgerEvent[];
  snaps: Snap[];
  enforce: boolean;
  labeled: boolean;
  chainOk: boolean;
  clock: number;
  revs: PolicyRev[];
  appliedCatalog: string;
  applied: Artifact[];
};
