export type AuthStatus = "unsigned" | "classical" | "hash-only" | "held-pq";

export type CodeAuth = {
  id: string;
  subsystem: string;
  authenticates: string;
  today: string;
  algorithm: string;
  status: AuthStatus;
  redundancy: string;
  note: string;
};

/**
 * Authentication of *code* (and code-shaped objects: klds, policy, send
 * streams), not of login credentials. T2 already said A_auth of a name is
 * a different game from A_D/A_M. This table is the remaining game: who
 * signed the bits the monitor will interpret.
 *
 * "Redundancy" here means two independent reductions, not two copies on disk.
 * RAID-Z is not a second signature.
 */
export const CODE_AUTH: CodeAuth[] = [
  {
    id: "pkg",
    subsystem: "pkg(8) repository",
    authenticates: "packages the operator installs",
    today: "repo signature over a digest",
    algorithm: "RSA PKCS#1 v1.5 (libpkg pkgsign_ossl)",
    status: "classical",
    redundancy: "none — one RSA key",
    note: "Shor forges the repo. A quantum adversary publishes a signed mac_lomac.ko that is not yours. Mediation of the forged module is then PQ-stable and wrong.",
  },
  {
    id: "freebsd-update",
    subsystem: "freebsd-update(8)",
    authenticates: "base, kernel, world patches",
    today: "metadata signature from update.FreeBSD.org",
    algorithm: "OpenSSL RSA (historically)",
    status: "classical",
    redundancy: "none",
    note: "The patch that lands setfsmac, login.conf, and GENERIC is authenticated classically. After install, A_M does not re-check origin.",
  },
  {
    id: "uefi",
    subsystem: "UEFI Secure Boot",
    authenticates: "boot1.efi / loader.efi blob",
    today: "firmware db / shim, typically Microsoft-signed",
    algorithm: "RSA / PKCS (platform)",
    status: "classical",
    redundancy: "firmware db only",
    note: "FreeBSD Foundation: stock boot1 does not verify loader, and loader does not verify the kernel. Combining loader+kernel into one signed object is a workaround, still RSA.",
  },
  {
    id: "loader-kernel",
    subsystem: "loader.efi → kernel",
    authenticates: "kernel image and preloaded modules",
    today: "none in GENERIC",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none — a gap in the chain",
    note: "Junos has Verified Exec; the loader gap was the stated problem. Stock FreeBSD kload of a swapped kernel is not an A_auth failure of a signature. There is no signature.",
  },
  {
    id: "kld",
    subsystem: "kldload(8)",
    authenticates: "mac_*.ko and every other module",
    today: "none in GENERIC",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    note: "Root equal(equal-equal) plus unsigned kld is load-anything. Linux module.sig_enforce is not here. SEBSD as a .ko would be unsigned code-equivalent policy unless pqcode signs it.",
  },
  {
    id: "policy",
    subsystem: "setfsmac / login.conf / dac.contexts",
    authenticates: "the policy the monitor will interpret",
    today: "file mode + LOMAC label",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    note: "A high labeled policy file is integrity-protected against the sandbox, not origin-authenticated. Whoever could write it while high has defined A_M.",
  },
  {
    id: "rc",
    subsystem: "rc.d one* scripts this suite emits",
    authenticates: "the operator's morphisms",
    today: "0755 root, copied by oneinstall",
    algorithm: "—",
    status: "unsigned",
    redundancy: "none",
    note: "The skill is a compiler of policy. Unsigned output is unsigned policy. Sign the result directory, not the chat.",
  },
  {
    id: "zfs-checksum",
    subsystem: "ZFS block checksum",
    authenticates: "stored blocks against silent corruption",
    today: "fletcher4 default; sha256/sha512 optional",
    algorithm: "Fletcher (not crypto) or SHA-2",
    status: "hash-only",
    redundancy: "copies=/raidz is storage, not a second hash family",
    note: "Fletcher is not A_auth. sha256 is Grover-halved (128-bit). Confirmable integrity of bits, not of origin. T10 lives here; it is not a signature.",
  },
  {
    id: "zfs-send",
    subsystem: "zfs send | zfs receive",
    authenticates: "the dataset morphism across a pipe",
    today: "stream checksum; no signature",
    algorithm: "Fletcher on the stream",
    status: "unsigned",
    redundancy: "none",
    note: "Whoever writes the pipe defines the pool. receive -F is a write. A_M may label the result; it does not know who sent it. This is why pqzfs is a skill, not a mount option.",
  },
  {
    id: "zfs-enc",
    subsystem: "ZFS native encryption",
    authenticates: "confidentiality of a dataset at rest",
    today: "AES-CCM/GCM; wrapping key from passphrase or keyfile",
    algorithm: "AES-256 (wrapping is symmetric)",
    status: "hash-only",
    redundancy: "wrapping must not become RSA",
    note: "AES-256 under Grover is 128-bit. This is secrecy of stored bits, not authentication of code. Do not wrap the wrapping key in RSA/ECC.",
  },
  {
    id: "ledger",
    subsystem: "pqledger chain",
    authenticates: "that an event was recorded, in order",
    today: "SHA-256 (workbench) / SHA-512 (host)",
    algorithm: "SHA-2",
    status: "hash-only",
    redundancy: "one hash family",
    note: "T7 is Integrity Evidence of ops. A second hash (SHA-3) or an SLH-DSA over checkpoints is redundancy. Not implemented.",
  },
  {
    id: "payload",
    subsystem: "object bytes (T10)",
    authenticates: "that the bits read were the bits written",
    today: "not implemented",
    algorithm: "proposed Merkle / content digest",
    status: "held-pq",
    redundancy: "none yet",
    note: "Hash confirmation, Grover-halved. A signature over the Merkle root is code-auth of the snapshot, not of a login.",
  },
];

export const AUTH_CLAIM = `Mediation (A_D, A_M, MMU) is quantum-adversary-stable because it is not a cryptographic game — T2. That is not a proof that the *system* is post-quantum secure. The system interprets code: kernel, klds, pkg, policy files, zfs send streams, the rc.d this skill emits. If that code is authenticated by RSA, Shor forges the input to a PQ-stable monitor. The monitor then correctly enforces a policy the adversary wrote.

Authentication here is of code, not of credentials. Replacing sshd's host key with ML-KEM is necessary and insufficient for this table. Signing the kernel, the module, the policy, and the send stream is the remaining A_auth.

Redundancy is two independent reductions, not two disks. NIST already split the signature problem: ML-DSA (FIPS 204, lattices) and SLH-DSA (FIPS 205, hashes) so a break of one family does not take the other. A subsystem that has only RSA, or only a hash, or nothing, does not yet have sufficient redundancy.`;
