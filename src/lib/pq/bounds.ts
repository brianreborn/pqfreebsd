import { chainBreak } from "./code-auth";
import type { World } from "./types";

export type BitBound = number | "n/a";

export type MeasureKind =
  | "mediation"
  | "lattice"
  | "hru"
  | "hash"
  | "symmetric"
  | "signature"
  | "kem"
  | "none";

export type Measure = {
  id: string;
  claim: string;
  kind: MeasureKind;
  measure: string;
  proves: string;
  upto: string;
  assumption: string;
  live: "this-pass" | "held" | "depends";
  /** Classical PPT / generic attacks. Birthday already applied for collisions. */
  classical: { bits: BitBound; note: string };
  /** Qubit BQP: Grover, Shor, BHT where they apply. */
  qubit: { bits: BitBound; note: string };
  /**
   * Non-binary (qudit) quantum. Amplitude amplification is still Θ(√N) in the
   * standard query model; Shor's period-finding generalizes. Not a free lunch
   * past Grover, not a skip of T2.
   */
  qudit: { bits: BitBound; note: string };
  /** Continuous-variable / analog quantum. Cost model differs; mediation does not. */
  cvqc: { bits: BitBound; note: string };
};

function hashBits(name: World["policy"]["hashName"]): Pick<Measure, "classical" | "qubit" | "qudit" | "cvqc"> {
  const n = name === "SHA-512" ? 512 : 256;
  const birthday = n / 2;
  const bht = Math.floor(n / 3);
  const grover = n / 2;
  return {
    classical: {
      bits: birthday,
      note: `${name} collision ≈ ${birthday}-bit (birthday). Preimage ${n}-bit.`,
    },
    qubit: {
      bits: Math.min(grover, bht),
      note: `Grover preimage ≈ ${grover}-bit. BHT collision ≈ ${bht}-bit. Not Shor-broken.`,
    },
    qudit: {
      bits: Math.min(grover, bht),
      note: "d-ary amplitude amplification is still √N queries. Do not count extra bits.",
    },
    cvqc: {
      bits: Math.min(grover, bht),
      note: "Treat as Grover-class until a named analog-hash result exists. Do not claim more.",
    },
  };
}

export function evaluateBounds(world: World): Measure[] {
  const hash = hashBits(world.policy.hashName ?? "SHA-256");
  const cot = chainBreak();
  const replicaOn = Boolean(world.policy.replicaEnabled);
  const stranded = Boolean(world.stranded);

  return [
    {
      id: "mediation",
      claim: "T1–T2",
      kind: "mediation",
      measure: "Write accepted by the reference monitor",
      proves: "Membership in BQP (or a qudit/CVQC analogue) does not by itself produce a classical vnode write the hooks accept.",
      upto: "Hook coverage, labeled objects, enabled=1, and the bits A_M interprets (T11/T15). Unlabeled / enabled=0 is a different relation.",
      assumption: "Anderson complete mediation of the named object alphabet. Not a cryptographic assumption.",
      live: "this-pass",
      classical: { bits: "n/a", note: "Not a bit-game. chmod is classical regardless of the adversary's workspace." },
      qubit: { bits: "n/a", note: "BQP does not inhabit the hook. Same bound as classical." },
      qudit: { bits: "n/a", note: "d-level amplitudes still collapse to a classical store. Same bound." },
      cvqc: { bits: "n/a", note: "An analog machine that would write a file still writes through A_M." },
    },
    {
      id: "lomac",
      claim: "T2 / lattice",
      kind: "lattice",
      measure: "Write-up denied after a low read",
      proves: "Short proof: sandbox at lomac/10[2] cannot write a high OS object once demoted.",
      upto: "Official PLM combinator, ifnet defaults, root equal(equal-equal) as exemption not containment.",
      assumption: "mac_lomac(4) as specified. Labels attached at login.",
      live: world.policy.withLomac && world.enforce ? "this-pass" : "depends",
      classical: { bits: "n/a", note: world.enforce ? "Enforcing. Lattice, not bits." : "Staged — claim not made (enabled=0)." },
      qubit: { bits: "n/a", note: "Same. Demotion is a classical label morphism." },
      qudit: { bits: "n/a", note: "Same." },
      cvqc: { bits: "n/a", note: "Same." },
    },
    {
      id: "dac",
      claim: "T6–T7",
      kind: "hru",
      measure: "Restricted A_D is HRU-safe",
      proves: "No arbitrary grant verbs. Establish/repair/prevent from a first-match spec.",
      upto: "The spec's regex alphabet, first-match (not a join), empty ugidfw if prevent is claimed without rules.",
      assumption: "Harrison–Ruzzo–Ullman safety for the restricted language, not for Unix chmod in general.",
      live: world.policy.dacMode === "observe" ? "depends" : "this-pass",
      classical: { bits: "n/a", note: `Mode ${world.policy.dacMode}. Safety is of the language, not of a bit length.` },
      qubit: { bits: "n/a", note: "HRU is not Shor-broken. A quantum adversary still needs a classical grant." },
      qudit: { bits: "n/a", note: "Same." },
      cvqc: { bits: "n/a", note: "Same." },
    },
    {
      id: "ledger-hash",
      claim: "T8–T9",
      kind: "hash",
      measure: "Local Integrity Evidence chain",
      proves: "Tamper of a recorded event is detected if the hash is collision-resistant.",
      upto: "Local host only. Rewrite of HEAD without detection if the adversary writes the dataset. Off-host is a different measure.",
      assumption: `${world.policy.hashName ?? "SHA-256"} collision / preimage resistance.`,
      live: "this-pass",
      ...hash,
    },
    {
      id: "replica",
      claim: "T14",
      kind: replicaOn ? "hash" : "none",
      measure: "Off-host IE storage and validation",
      proves: replicaOn
        ? "A named peer has stored HEAD and verified the chain — when transport succeeds."
        : "Nothing. Module not included. Silent, not a zero-bit lie.",
      upto: "Peer honesty, transport authenticity (T15 hop 12), network. Stranded → this measure only.",
      assumption: replicaOn ? "Peer is a second Anderson host, not a second disk." : "n/a",
      live: replicaOn ? "depends" : "depends",
      classical: {
        bits: !replicaOn ? "n/a" : stranded ? 0 : hash.classical.bits,
        note: !replicaOn ? "Silent." : stranded ? "0 — cannot transport. Local IE unbound by this row." : "On-net; bound follows the hash, not TLS (TLS is hop 12).",
      },
      qubit: {
        bits: !replicaOn ? "n/a" : stranded ? 0 : hash.qubit.bits,
        note: !replicaOn ? "Silent." : stranded ? "Availability 0. Grover does not un-strand you." : hash.qubit.note,
      },
      qudit: {
        bits: !replicaOn ? "n/a" : stranded ? 0 : hash.qudit.bits,
        note: !replicaOn ? "Silent." : "Same as qubit for this measure.",
      },
      cvqc: {
        bits: !replicaOn ? "n/a" : stranded ? 0 : hash.cvqc.bits,
        note: !replicaOn ? "Silent." : "Same.",
      },
    },
    {
      id: "aes",
      claim: "secrecy",
      kind: "symmetric",
      measure: "ZFS native encryption (AES-256)",
      proves: "Confidentiality of stored bits against a generic attacker of the ciphertext.",
      upto: "Wrapping key handling. RSA wrapping would zero the quantum bound. Not origin.",
      assumption: "AES-256, no related-key footgun, keyfile/passphrase not RSA-wrapped.",
      live: "held",
      classical: { bits: 256, note: "Generic exhaustive. Not origin of the dataset." },
      qubit: { bits: 128, note: "Grover. Not Shor-broken." },
      qudit: { bits: 128, note: "√N still. Do not claim 256 against qudits." },
      cvqc: { bits: 128, note: "Treat as Grover-class." },
    },
    {
      id: "rsa-pkg",
      claim: "T11 hop 4–5",
      kind: "signature",
      measure: "pkg / freebsd-update origin (today)",
      proves: "Nothing against a quantum forger. Classical RSA-2048 ≈ 112-bit.",
      upto: "The hop is the bound. Shor zeros it.",
      assumption: "Factoring. False under BQP.",
      live: "this-pass",
      classical: { bits: 112, note: "RSA-2048 ballpark. One key, no second family." },
      qubit: { bits: 0, note: "Shor. The particular is not post-quantum." },
      qudit: { bits: 0, note: "Period-finding generalizes. Still 0." },
      cvqc: { bits: 0, note: "Do not hide RSA behind analog machinery." },
    },
    {
      id: "mldsa",
      claim: "T15 eventual",
      kind: "signature",
      measure: "ML-DSA (FIPS 204) origin hop",
      proves: "EUF-CMA under MLWE/SIS-style assumptions, NIST category by parameter set (2/3/5).",
      upto: "Implementation, key handling, and the second family (SLH-DSA). One lattice family is not redundancy.",
      assumption: "Module-LWE / Module-SIS. Not Shor.",
      live: "held",
      classical: { bits: 128, note: "Category 2 floor until a parameter set is chosen. Not shipped." },
      qubit: { bits: 128, note: "Same category. Lattice, not Grover-halved RSA." },
      qudit: { bits: 128, note: "No known qudit skip of MLWE. Category unchanged until a paper says otherwise." },
      cvqc: { bits: 128, note: "Same caution. Do not claim a CV break or a CV proof." },
    },
    {
      id: "slhdsa",
      claim: "T15 eventual",
      kind: "signature",
      measure: "SLH-DSA (FIPS 205) origin hop",
      proves: "Hash-based EUF-CMA. Second independent reduction beside ML-DSA.",
      upto: "State discipline if a stateful sibling were used; SLH-DSA is stateless. Hash assumption.",
      assumption: "SPHINCS+ / SHA-2 or SHAKE as specified.",
      live: "held",
      classical: { bits: 128, note: "Category 2 floor until a parameter set is chosen. Not shipped." },
      qubit: { bits: 128, note: "Hash-based. Grover already in the parameter choice." },
      qudit: { bits: 128, note: "Same as qubit unless a named d-ary hash attack exists." },
      cvqc: { bits: 128, note: "Same caution." },
    },
    {
      id: "mlkem",
      claim: "T15 hop 12",
      kind: "kem",
      measure: "ML-KEM (FIPS 203) replica transport",
      proves: "IND-CCA under MLWE, when the replica module is included and on-net.",
      upto: "Stranded → availability 0 (T14). Classical TLS today is a 0 quantum hop if the module uses it.",
      assumption: "Module-LWE.",
      live: "held",
      classical: { bits: 128, note: "Category 2 floor. Not shipped. Today's TLS is the rsa-pkg row, not this one." },
      qubit: { bits: 128, note: "Lattice. Shor does not apply." },
      qudit: { bits: 128, note: "Same as ML-DSA row." },
      cvqc: { bits: 128, note: "Same caution." },
    },
    {
      id: "cot",
      claim: "T15",
      kind: "none",
      measure: "Unbroken cryptographic chain of origin",
      proves: cot.unbroken ? "Every origin hop is PQ." : "Nothing. The chain is not unbroken.",
      upto: cot.at ? `Breaks at hop ${cot.at.hop} (${cot.at.subsystem}).` : "Implementation of every hop.",
      assumption: "Conjunction of the PQ particulars. Not a product with T2.",
      live: "held",
      classical: { bits: cot.unbroken ? 128 : 0, note: cot.reason },
      qubit: { bits: cot.unbroken ? 128 : 0, note: "Shor zeros any remaining RSA hop." },
      qudit: { bits: cot.unbroken ? 128 : 0, note: "Same break point. Non-binary does not close hop 1." },
      cvqc: { bits: cot.unbroken ? 128 : 0, note: "Same." },
    },
  ];
}

export function boundFrontier(measures: Measure[]) {
  const live = measures.filter((m) => m.live === "this-pass");
  const zeros = measures.filter((m) => m.qubit.bits === 0);
  return {
    live: live.length,
    held: measures.filter((m) => m.live === "held").length,
    qubitZero: zeros.map((m) => m.id),
    summary: `Provable this pass: ${live.length} measures. Quantum-zero (Shor or missing hop): ${zeros.map((m) => m.id).join(", ") || "none"}. Held particulars are parameterized, not shipped.`,
  };
}
