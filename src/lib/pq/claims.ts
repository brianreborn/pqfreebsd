import { audit } from "./audit";
import { chainBreak } from "./code-auth";
import { verifyChain } from "./host";
import type { World } from "./types";

export type ClaimStatus = "holds" | "degraded" | "silent" | "held" | "broken";

export type Claim = {
  id: string;
  module: string;
  thesis: string;
  title: string;
  status: ClaimStatus;
  detail: string;
  holdsWhen: string;
  degradesWhen: string;
};

function chainOk(world: World) {
  if (!world.chainOk) return false;
  return verifyChain(world.ledger).ok;
}

export function evaluateClaims(world: World): Claim[] {
  const p = world.policy;
  const report = audit(world);
  const chain = chainOk(world);
  const stranded = Boolean(world.stranded);
  const replica = Boolean(p.replicaEnabled);
  const peer = (p.replicaPeer ?? "").trim();

  return [
    {
      id: "mediation",
      module: "mac_lomac",
      thesis: "T1–T2",
      title: "Low-integrity cannot overwrite high-integrity OS files",
      status: !p.withLomac ? "silent" : !world.enforce ? "silent" : "holds",
      detail: !p.withLomac
        ? "mac_lomac not composed. This box does not claim the integrity lattice."
        : !world.enforce
          ? "Staged (enabled=0). Claim not made until oneenforce."
          : "A low-integrity process cannot overwrite high-integrity OS files after reading low-integrity data.",
      holdsWhen: "mac_lomac loaded, labeled, enabled=1",
      degradesWhen: "never into a product with other modules — unlabeled is a different relation",
    },
    {
      id: "seeotheruids",
      module: "mac_seeotheruids",
      thesis: "praxis",
      title: "Other UIDs are hidden (exempt GID 0)",
      status: p.withSeeotheruids ? (world.enforce ? "holds" : "silent") : "silent",
      detail: p.withSeeotheruids
        ? world.enforce
          ? "Orthogonal module loaded. Not a second lattice."
          : "Composed, not yet enforcing."
        : "Not composed. No claim that subjects cannot see each other.",
      holdsWhen: "module loaded",
      degradesWhen: "does not degrade LOMAC if absent",
    },
    {
      id: "ledger-local",
      module: "pqledger",
      thesis: "T8–T9",
      title: "Integrity Evidence chain verifies on this host",
      status: !chain ? "broken" : "holds",
      detail: chain
        ? `HEAD intact, ${world.ledger.length} events, hash ${p.hashName}. Local only.`
        : "Chain BROKEN. Local IE claim is false. Other modules are not thereby false.",
      holdsWhen: "append-only chain, high dataset, rewrite is a bug",
      degradesWhen: "tamper / unlabeled ledger — local IE only, not mediation",
    },
    {
      id: "ledger-replica",
      module: "pqledger-replica",
      thesis: "T14",
      title: "IE independently stored and validated on another host",
      status: !replica
        ? "silent"
        : stranded || !peer
          ? "degraded"
          : world.replicaOk
            ? "holds"
            : "degraded",
      detail: !replica
        ? "Module not included. This deployment does not claim off-host IE. A box that includes and enables it keeps that claim."
        : stranded
          ? `Network stranded. Cannot securely transport the ledger to ${peer || "(no peer)"}. Local chain may still hold; independent storage is not confirmed.`
          : !peer
            ? "Replica enabled but no peer named. Claim degraded until a host is agreed."
            : world.replicaOk
              ? `Peer ${peer} has stored and hashed the catalog. Independent storage confirmed.`
              : `Peer ${peer} reachable; transport not yet successful.`,
      holdsWhen: "replica module included and enabled, peer named, secure transport, peer verifies the chain",
      degradesWhen: "network stranded, no peer, transport refused — weakens only this claim",
    },
    {
      id: "dac",
      module: "pqdac",
      thesis: "T6–T7",
      title: "A_D matches the spec (establish / repair / prevent)",
      status: p.dacMode === "observe" ? "silent" : "holds",
      detail:
        p.dacMode === "observe"
          ? "observe only. Drift is logged, not a repaired matrix. No claim that A_D is the intended relation."
          : `${p.dacMode}: restricted language, first-match, HRU-safe. Drift is a repair, not a grant.`,
      holdsWhen: "spec established; repair or prevent morphism",
      degradesWhen: "observe-only — silent, not a lie about LOMAC",
    },
    {
      id: "policy-revs",
      module: "pqaudit",
      thesis: "T13",
      title: "Successive policy is chained and live matches applied",
      status: report.ok ? "holds" : report.draft ? "degraded" : report.fails.length ? "broken" : "degraded",
      detail: report.summary,
      holdsWhen: "onepropagate; catalog hash chained; oneaudit clean",
      degradesWhen: "draft ≠ applied. Does not un-prove high-integrity overwrite protection.",
    },
    {
      id: "boot",
      module: "pqboot",
      thesis: "T12",
      title: "Loader gated on attestation (TPM not this pass)",
      status: p.bootSatisfied ? "holds" : "silent",
      detail: p.bootSatisfied
        ? "Attested. oneboot offered. TPM / measured boot still held. The splash mark is not this claim."
        : "Not attested. oneboot refused. Stock loader. No claim that the loader is ours.",
      holdsWhen: "BOOT_SATISFIED=YES — gate open for this pass only",
      degradesWhen: "TPM absence is a held conjunct, not a failed mark",
    },
    {
      id: "code",
      module: "pqcode",
      thesis: "T11",
      title: "Bits the monitor interprets are PQ-authenticated",
      status: "held",
      detail: "Held, open-ended, not a 1.0 requirement. RSA/unsigned kld is a missing conjunct of a later cut. T2 still holds. Do not claim the chain is unbroken.",
      holdsWhen: "ML-DSA and SLH-DSA on kernel, kld, pkg, policy",
      degradesWhen: "absence is silent (not claimed), not a product failure",
    },
    {
      id: "zfs-send",
      module: "pqzfs",
      thesis: "T11",
      title: "ZFS send is authenticated, checksum is not fletcher",
      status: "held",
      detail: "Not this pass. Unsigned send does not un-prove local LOMAC.",
      holdsWhen: "dual signatures on the stream; sha512 on labeled datasets",
      degradesWhen: "stranded send is a missing conjunct of pqzfs, not of A_M",
    },
    {
      id: "payload",
      module: "pqconfirm",
      thesis: "T10",
      title: "Payload integrity is confirmable",
      status: "held",
      detail: "Required of the system, not implemented. Local IE is not payload confirmation.",
      holdsWhen: "Merkle of the labeled store bound to a ledger checkpoint",
      degradesWhen: "held — do not pretend scrub discharges it",
    },
    {
      id: "sebsd",
      module: "mac-sebsd",
      thesis: "held",
      title: "Type Enforcement as complete mediation language",
      status: "held",
      detail: "Skill exists. No mac_sebsd.ko in GENERIC 14/15. Last tree 7.0-SEBSD 2006-07-05. onestart refused until a kernel-matched dated module is named. Absence is silent for T2.",
      holdsWhen: "FLASK/TE loaded from a kernel-matched module, policy compiled",
      degradesWhen: "missing kld is silent, not a product failure of LOMAC",
    },
    {
      id: "tpm",
      module: "pqboot",
      thesis: "T12",
      title: "Measured boot / TPM",
      status: "held",
      detail: "Not this pass. Splash attestation is a different claim.",
      holdsWhen: "PCRs, quoted, PQ-signed",
      degradesWhen: "held conjunct; does not degrade the loader gate",
    },
    {
      id: "cot",
      module: "pqcode",
      thesis: "T15",
      title: "Unbroken cryptographic chain of trust; every particular PQ",
      status: "held",
      detail: chainBreak().reason + " Required eventually. Not claimed this pass. A broken CoT does not un-prove high-integrity overwrite protection.",
      holdsWhen: "every crypto hop is ML-DSA+SLH-DSA, ML-KEM, or Grover-accounted hash under a PQ-signed root",
      degradesWhen: "a classical or unsigned hop breaks the chain from that point down — T14 still applies to mediation",
    },
  ];
}

export function claimTally(claims: Claim[]) {
  const tally: Record<ClaimStatus, number> = {
    holds: 0,
    degraded: 0,
    silent: 0,
    held: 0,
    broken: 0,
  };
  for (const c of claims) tally[c.status] += 1;
  return tally;
}
