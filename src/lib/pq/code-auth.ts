export type AuthStatus = "unsigned" | "classical" | "hash-only" | "hybrid" | "held-pq";

export type CodeAuth = {
  id: string;
  hop: number;
  subsystem: string;
  authenticates: string;
  today: string;
  algorithm: string;
  status: AuthStatus;
  redundancy: string;
  pqReplace: string;
  role: "origin" | "integrity" | "secrecy";
  note: string;
};

/**
 * Cryptographic chain of trust, firmware → replica, plus code-shaped objects
 * the monitor will interpret. Authentication of *code*, not of credentials.
 *
 * T15: the chain must eventually be unbroken, and every cryptographic
 * particular replaced with a post-quantum algorithm. A classical hop breaks
 * the chain from that point down. It does not un-prove high-integrity overwrite protection (T14).
 *
 * Redundancy is two independent reductions, not two disks.
 */
export const CODE_AUTH: CodeAuth[] = [
  {
    id: "uefi",
    hop: 1,
    subsystem: "UEFI Secure Boot / firmware db",
    authenticates: "loader.efi as the trust anchor's first child",
    today: "firmware db / shim, typically Microsoft-signed",
    algorithm: "RSA / PKCS (platform)",
    status: "classical",
    redundancy: "firmware db only",
    pqReplace: "ML-DSA + SLH-DSA in db. Hybrid is a transition particular, not the eventual chain.",
    role: "origin",
    note: "Stock boot1 does not verify loader. Combining loader+kernel into one signed object is a workaround, still RSA. TPM quotes are a later hop, not this pass.",
  },
  {
    id: "loader-kernel",
    hop: 2,
    subsystem: "loader.efi → kernel",
    authenticates: "kernel image and preloaded modules",
    today: "none in GENERIC",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none — a gap in the chain",
    pqReplace: "PQ-signed loader+kernel object (ML-DSA and SLH-DSA). Unsigned is not a particular to replace — it is a missing hop.",
    role: "origin",
    note: "Junos Verified Exec named this gap. kload of a swapped kernel is not an A_auth failure of a signature. There is no signature.",
  },
  {
    id: "kld",
    hop: 3,
    subsystem: "kldload(8)",
    authenticates: "mac_*.ko and every other module",
    today: "none in GENERIC",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    pqReplace: "module.sig_enforce equivalent: ML-DSA and SLH-DSA over each .ko.",
    role: "origin",
    note: "Root equal plus unsigned kld is load-anything. SEBSD as a .ko is unsigned code-equivalent policy unless this hop is closed.",
  },
  {
    id: "pkg",
    hop: 4,
    subsystem: "pkg(8) repository",
    authenticates: "packages the operator installs",
    today: "repo signature over a digest",
    algorithm: "RSA PKCS#1 v1.5 (libpkg pkgsign_ossl)",
    status: "classical",
    redundancy: "none — one RSA key",
    pqReplace: "ML-DSA and SLH-DSA repo signatures. RSA dual-sign only during transition.",
    role: "origin",
    note: "Shor forges the repo. A quantum adversary publishes a signed mac_lomac.ko that is not yours.",
  },
  {
    id: "freebsd-update",
    hop: 5,
    subsystem: "freebsd-update(8)",
    authenticates: "base, kernel, world patches",
    today: "metadata signature from update.FreeBSD.org",
    algorithm: "OpenSSL RSA (historically)",
    status: "classical",
    redundancy: "none",
    pqReplace: "ML-DSA and SLH-DSA on update metadata. Same two families as pkg.",
    role: "origin",
    note: "The patch that lands setfsmac, login.conf, and GENERIC is authenticated classically.",
  },
  {
    id: "policy",
    hop: 6,
    subsystem: "setfsmac / login.conf / dac.contexts",
    authenticates: "the policy the monitor will interpret",
    today: "file mode + LOMAC label",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    pqReplace: "SLH-DSA (and ML-DSA) over the policy catalog hash from T13.",
    role: "origin",
    note: "A high labeled file is integrity-protected against the sandbox, not origin-authenticated.",
  },
  {
    id: "rc",
    hop: 7,
    subsystem: "rc.d one* this suite emits",
    authenticates: "the operator's morphisms",
    today: "0755 root, copied by oneinstall",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    pqReplace: "Sign the result directory with both families. Sign the chat? No. Sign the bits that will run.",
    role: "origin",
    note: "The skill is a compiler of policy. Unsigned output is unsigned policy.",
  },
  {
    id: "ledger",
    hop: 8,
    subsystem: "pqledger chain",
    authenticates: "that an event was recorded, in order",
    today: "SHA-256 (workbench) / SHA-512 (host)",
    algorithm: "SHA-2",
    status: "hash-only",
    redundancy: "one hash family",
    pqReplace: "SHA-512 or SHA-3 (Grover-accounted) plus SLH-DSA over checkpoints. Hash is integrity of sequence, not origin, until signed.",
    role: "origin",
    note: "T7 local IE can hold while this hop is hash-only. The CoT cannot.",
  },
  {
    id: "zfs-checksum",
    hop: 9,
    subsystem: "ZFS block checksum",
    authenticates: "stored blocks against silent corruption",
    today: "fletcher4 default; sha256/sha512 optional",
    algorithm: "Fletcher (not crypto) or SHA-2",
    status: "hash-only",
    redundancy: "copies=/raidz is storage, not a second hash family",
    pqReplace: "sha512 on labeled datasets. Fletcher is not a cryptographic particular — it must be removed, not replaced.",
    role: "integrity",
    note: "T10 lives here. Confirmable integrity of bits, not of origin.",
  },
  {
    id: "zfs-send",
    hop: 10,
    subsystem: "zfs send | zfs receive",
    authenticates: "the dataset morphism across a pipe",
    today: "stream checksum; no signature",
    algorithm: "Fletcher on the stream",
    status: "unsigned",
    redundancy: "none",
    pqReplace: "ML-DSA and SLH-DSA over the send stream. Receive refuses unless both verify.",
    role: "origin",
    note: "Whoever writes the pipe defines the pool. This is why pqzfs is a skill, not a mount option.",
  },
  {
    id: "zfs-enc",
    hop: 11,
    subsystem: "ZFS native encryption",
    authenticates: "confidentiality of a dataset at rest (not origin)",
    today: "AES-CCM/GCM; wrapping key from passphrase or keyfile",
    algorithm: "AES-256 (wrapping is symmetric)",
    status: "hash-only",
    redundancy: "wrapping must not become RSA",
    pqReplace: "AES-256 remains acceptable at 128-bit Grover for secrecy. Wrapping keys: never RSA/ECC. If a KEM is needed, ML-KEM.",
    role: "secrecy",
    note: "Secrecy of stored bits, not a hop of origin. Still a cryptographic particular of the base.",
  },
  {
    id: "replica-tls",
    hop: 12,
    subsystem: "ledger replica transport",
    authenticates: "the channel that carries IE to the peer",
    today: "not included by default; if enabled, typically TLS 1.2/1.3",
    algorithm: "ECDHE + RSA/ECDSA certificates (usual)",
    status: "classical",
    redundancy: "none",
    pqReplace: "ML-KEM for the handshake, ML-DSA and SLH-DSA for the peer cert. Stranded (T14) degrades this hop's *availability*, not the algorithm. A classical TLS hop breaks the CoT even on-net.",
    role: "origin",
    note: "T14: stranded → off-host IE degraded. T15: classical TLS → CoT broken at this hop when the module is included.",
  },
  {
    id: "payload",
    hop: 13,
    subsystem: "object bytes (T10)",
    authenticates: "that the bits read were the bits written",
    today: "not implemented",
    algorithm: "proposed Merkle / content digest",
    status: "held-pq",
    redundancy: "none yet",
    pqReplace: "Merkle of the labeled store, SHA-512/SHA-3, SLH-DSA over the root bound to a ledger checkpoint.",
    role: "integrity",
    note: "A signature over the Merkle root is code-auth of the snapshot, not of a login.",
  },
];

export function chainBreak(rows: CodeAuth[] = CODE_AUTH) {
  const ordered = [...rows].sort((a, b) => a.hop - b.hop);
  const origin = ordered.filter((r) => r.role === "origin");
  const at = origin.find((r) => r.status !== "held-pq");
  return {
    unbroken: origin.length > 0 && origin.every((r) => r.status === "held-pq"),
    at: at ?? null,
    reason: at
      ? `chain of origin breaks at hop ${at.hop} (${at.subsystem}): ${at.status} · ${at.algorithm === "—" ? "no signature" : at.algorithm}`
      : "every origin hop is post-quantum (ML-DSA+SLH-DSA / ML-KEM). Integrity and secrecy hops are accounted separately.",
  };
}

export const AUTH_CLAIM = `Mediation (A_D, A_M, MMU) is quantum-adversary-stable because it is not a cryptographic game — T2. That is not a proof that the *system* is post-quantum secure.

An unbroken cryptographic chain of trust is a necessary requirement of the trusted base (T15). Each cryptographic particular in that chain — firmware db, loader, kernel, kld, pkg, freebsd-update, policy, rc.d, ledger checkpoint, zfs send, replica transport — must eventually be replaced with post-quantum algorithms. Signatures: ML-DSA (FIPS 204) and SLH-DSA (FIPS 205). Transport: ML-KEM (FIPS 203). Hashes: SHA-512 or SHA-3, Grover-accounted. AES-at-rest is secrecy, not origin.

A classical or missing hop breaks the chain from that point down. Hybrid (classical+PQ) is a transition particular, not the eventual chain: Shor still forges the classical half. T14 still holds: a broken CoT does not un-prove high-integrity overwrite protection. This pass catalogs the hops. It does not claim the chain is unbroken.`;
