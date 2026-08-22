export type Thesis = {
  id: string;
  title: string;
  body: string;
  kind: "inherited" | "pqfreebsd" | "held";
};

export const THESES: Thesis[] = [
  {
    id: "T1",
    kind: "inherited",
    title: "BQP does not write the vnode",
    body: "Membership in BQP does not by itself produce a classical write accepted by the reference monitor. A quantum adversary who would act as a subject must still induce a classical state the hooks accept.",
  },
  {
    id: "T2",
    kind: "inherited",
    title: "Mediation is not a cryptographic game",
    body: "A_D, A_M, and MMU translation are quantum-adversary-stable mediation on a von Neumann defender. They are post-quantum access control in that sense, and not post-quantum cryptography. Shor destroys A_auth when A_auth is RSA/ECC. It does not inhabit chmod or lomac/high.",
  },
  {
    id: "T3",
    kind: "inherited",
    title: "The plant may still distinguish",
    body: "Working hypothesis: some instrument on the plant, possibly entanglement-enhanced, can distinguish defender computation. This is not a corollary of Shor. Decoherence, placement, and GENERIC noise are the adversary's burden.",
  },
  {
    id: "T4",
    kind: "inherited",
    title: "Factor the observation, or fall silent",
    body: "If the observation function O factors through a kernel-visible subject, T1 and T2 constrain O. If not, T1 and T2 are silent and the property is physical non-interference — Faraday, constant-power logic, a secrecy lattice. POSIX MAC does not supply that.",
  },
  {
    id: "T5",
    kind: "inherited",
    title: "Quantum advantage on the plant is not free",
    body: "Do not take quantum advantage on the plant as a lemma from BQP. T5 keeps T3 from swallowing T1 and T2.",
  },
  {
    id: "T6",
    kind: "pqfreebsd",
    title: "Unspecified A_D is an unbounded HRU system",
    body: "Harrison–Ruzzo–Ullman safety for unrestricted discretionary matrices is undecidable. A restricted specification (path-regex → owner, group, mode, inherit) plus a repair morphism is a different relation: intended A_D is restored; residual owner-grants are bounded in duration. This does not make A_D into A_M. The owner can still chmod. Repair answers. Optional prevention is mac_bsdextended — a different module, a different proof.",
  },
  {
    id: "T7",
    kind: "pqfreebsd",
    title: "Anderson verifiability is a ledger, not a slogan",
    body: "Complete mediation and isolation are approximated by mac(4) and mac_lomac(4). Verifiability is not. A filesystem-level hash-chained ledger of vnode, label, and policy-morphism events is the monitor's Integrity Evidence. The ledger object is high in L; sandbox write-up fails. Tampering with the chain is a hash-collision problem (Grover halves the bits: production uses SHA-512 or SHA-3). That is A_auth of the evidence, not of the subject. The suite still does not kldload Kyber.",
  },
  {
    id: "T8",
    kind: "pqfreebsd",
    title: "Establish and repair are morphisms, not joins",
    body: "Dynamic establishment is the create-time morphism: new objects inherit A_D from the spec. Repair is the restore morphism when actual ≠ intended. setfsmac first-match and DAC first-match are combinators, not lattice operations. Conjunction with A_M is still not a product of proofs.",
  },
  {
    id: "T9",
    kind: "pqfreebsd",
    title: "The ledger daemon is a subject",
    body: "If O factors through the ledger writer, T4 applies. The ledger is not Faraday, not a naming retrofit, and not a secrecy lattice. LOMAC will not mute emanations of what a trusted subject was allowed to compute. A lockout is a failed interpretation, not successful confinement. Recovery remains inside the isolation claim.",
  },
  {
    id: "T10",
    kind: "held",
    title: "The data itself must be confirmable, to a certain extent",
    body: "A_M constrains who may write. The ledger records that a write occurred. Neither, by itself, lets a later subject confirm that the bits they read are the bits that were written. ZFS checksums detect silent corruption inside the pool; they are not a subject-visible confirmation API. A content digest — a Merkle over the labeled store, or a per-object hash recorded at ledger checkpoint — is confirmable to the extent of the hash. Grover halves the bits. This is not Faraday and not information-theoretic. Required of the system. Not implemented in this pass. Next skill: pqconfirm.",
  },
  {
    id: "T11",
    kind: "held",
    title: "A PQ-stable monitor interpreting RSA-signed code is a forged policy, correctly enforced",
    body: "T2 is mediation, not a cryptographic game. The system is not therefore post-quantum secure. Kernel, klds, pkg, freebsd-update, setfsmac policy, zfs send streams, and the rc.d this suite emits are code, or code-shaped. If they are unsigned, or signed with RSA/ECC, Shor forges the input to A_M. Authentication here is of code, not of credentials. Redundancy is two independent reductions — ML-DSA (FIPS 204, lattices) and SLH-DSA (FIPS 205, hashes) — not two disks. Fletcher, RAID-Z, and AES-at-rest are not a second signature. Held: pqcode, pqzfs. The suite still does not kldload Kyber; it would sign the bits the monitor runs.",
  },
  {
    id: "T12",
    kind: "held",
    title: "The splash is earned, and the beastie yields to the shield",
    body: "Once the operator attests they are sufficiently satisfied that the system is post-quantum hardened to the degree that gives them a sense of security, the umbrella offers oneboot: the loader splash name becomes pqfreebsd; the beastie is replaced by the shield — the armor of God; the loader is taken off the unsigned GENERIC path only as far as this pass can close. TPM and measured boot are not this pass. Default is no. Do not rebrand a box you do not yet trust. Branding is not a second signature family.",
  },
  {
    id: "T13",
    kind: "pqfreebsd",
    title: "Successive policy is itself an auditable object",
    body: "After install, the operator must be able to see that POLICY, SUITE, DAC, ugidfw, login labels, MAC overlays, and the splash agree, to propagate a change through all of them at once, and to read the diff of successive iterations. Consistency is a predicate over that conjunction, not a product of proofs. Each propagation is a named revision whose catalog hash is chained (prevCatalog) and recorded in the ledger. An audit that cannot show what changed is not an audit. oneaudit / onepropagate. test* first.",
  },
];

export const PRAXIS = [
  {
    id: "empty",
    title: "Empty interpretation",
    body: "Enabling A_M before setfsmac(8) is a different relation: unlabeled objects versus labeled processes. Keep security.mac.lomac.enabled=0 until a setfmac probe, then setfsmac. The ledger dataset must be labeled before enforce or it is an unlabeled hole.",
  },
  {
    id: "combinators",
    title: "Combinators are not joins",
    body: "setfsmac(8) first-match is not least upper bound in L. DAC specfiles use the same combinator. Overlays precede the official PLM. A proof that quotes the PLM without quoting the combinator is a proof of a different policy.",
  },
  {
    id: "alphabet",
    title: "The object alphabet moves",
    body: "The 2001 PLM names agp(4), syscons, /tmp/.X11-unix. GENERIC now names vt(4), evdev, DRM card*/renderD*, hidraw. A policy written against obsolete names is an unlabeled hole.",
  },
  {
    id: "login",
    title: "Subjects are created at login",
    body: "lambda(s) is a login.conf(5) field, compiled by cap_mkdb(1), attached by login(1). The shell used to edit the file is not in Sub under the new class. Roles are pw(8) groups bound to classes.",
  },
  {
    id: "ifnet",
    title: "Network objects are in the lattice",
    body: "Untrusted ifnets default low. trust_all_interfaces is RDTUN (loader.conf), not a live sysctl. Remote-only enforce demotes or kills the authentication path. This is T1 applied to the administrator's own subject.",
  },
  {
    id: "zfs",
    title: "The store is not UFS-shaped",
    body: "ZFS has no tunefs -l multilabel. Labels live in the system extattr namespace (OpenZFS freebsd:system prefix). Do not flip xattr=sa to “fix” LOMAC. Probe setfmac on /tmp; abort with enabled=0 if EINVAL persists after kldload.",
  },
  {
    id: "integrity-bug",
    title: "Integrity is experienced as a bug",
    body: "_secure_path: unable to stat .login_conf when a high subject su's into a low home is LOMAC/Biba as specified. Root equal(equal-equal) is exemption, not containment (mac(9)).",
  },
  {
    id: "conjunction",
    title: "Conjunction is not a product of proofs",
    body: "seeotheruids is orthogonal and a short proof. ifoff other_enabled=0 denies the ifnet. ugidfw empty is allow-all; new users miss rules until reload. Biba stacked on LOMAC is a product of incompatible axioms.",
  },
  {
    id: "recovery",
    title: "Recovery is inside the isolation claim",
    body: "A lockout is a failed interpretation, not successful confinement. PREINSTALL restores behavior. zfs snapshot -r is the dataset morphism. uninstall is not wipe and not rewind. test* before one*.",
  },
  {
    id: "auth",
    title: "Authentication still sits in front",
    body: "None of the above places A_auth in a BQP-hard problem. T2 is mediation after a name. Replacing the naming path with ML-KEM / ML-DSA is necessary and insufficient. Signing the code the monitor runs is T11, a different row.",
  },
  {
    id: "genesis",
    title: "Genesis is a named record",
    body: "An empty ledger is not an empty interpretation of A_M, but it is not evidence either. The first record is a named genesis (policy hash, dataset, hash name). Rotation appends a checkpoint record. Rewrite is a bug. /var/audit BSM files are the in-band source, not the chain.",
  },
  {
    id: "repair-window",
    title: "Repair bounds duration, not the syscall",
    body: "chmod still succeeds in repair mode; the window is the event duration. prevent mode is mac_bsdextended generated from the same spec. Do not rest a proof on aux covering xattrs (PR 178667).",
  },
  {
    id: "payload",
    title: "Event integrity is not payload integrity",
    body: "The ledger confirms that an op happened, in order, under a hash. It does not confirm the bytes of /home/green/notes. That confirmation is T10 / pqconfirm: digest the object (or a Merkle of the dataset) and bind the digest to a checkpoint record. Held. Do not pretend ZFS scrubs are that API.",
  },
  {
    id: "code-auth",
    title: "Sign the bits that run, not only the name that logs in",
    body: "pkg RSA, unsigned kldload, unsigned zfs send, unsigned policy files: each is an A_auth of code that T2 set aside. Hybrid ML-DSA + SLH-DSA is the redundancy. One family is not enough; RAID-Z is not a family. Do not wrap ZFS keys in RSA. Do not call the system post-quantum secure while these rows are classical or empty.",
  },
];

export const ABSTRACT = `Post-quantum cryptography is a claim about the residual hardness of named problems (lattices, hashes, codes) when the adversary's uniform class is BQP rather than BPP. Post-quantum access control, as used here, is a different claim: that the defender's authorization relation is not an instance of such a problem, and therefore does not collapse under Shor or Grover.

pqfreebsd derives from freebsd-mac-grok. That suite packaged A_M — mac_lomac(4) integrity, orthogonal modules, ZFS recursive snapshots, PREINSTALL recovery — and wrote pqac(7) as the paper. T1 and T2 are those packages. What the slogans omitted, and what this skill layers on, is Anderson's third property and the residual access matrix: a filesystem-level Integrity Evidence ledger, and a restricted A_D that is established at create and repaired on drift.

The system is not therefore post-quantum secure. Mediation is quantum-adversary-stable; the code the monitor interprets is not. Two further requirements are not implemented in this pass: payload integrity confirmable to a certain extent (T10 / pqconfirm), and authentication of code with two independent signature families (T11 / pqcode, pqzfs).`;

export const EXOTERIC = `Authentication binds an identity to a process. Authorization relates that process to objects and to regions of the store. The first, on contemporary FreeBSD, is cryptographic or a local console. The second is an access matrix (DAC: owner-directed chmod and chown, uid/gid) composed with a lattice policy (MAC) composed with translation rights (MMU).

Shor destroys A_auth when A_auth is RSA/ECC. It does not inhabit A_D or A_M. There is no reduction from period-finding to lomac/high or to the allocation of a PTE. That is quantum-adversary-stable mediation: the decision procedure's complexity class is not the source of its security, because the decision is not a cryptographic game. It is an interpreted predicate in the kernel.

The predicate is interpreted over bits that arrived somehow: a kernel, a kld, a pkg, a policy file, a zfs send stream. If those bits are authenticated by RSA, the game T2 set aside is back, sitting in front of the monitor.`;

export const ESOTERIC = `Those predicates are themselves electrical events. A page-table walk is current on a rail; a label in a system extended attribute is a pattern of stored charge. The in-band/out-of-band cut is an alphabet cut (syscalls versus analog traces), not a cut in the physics.

Imperviousness is a non-interference statement: traces that agree on low inputs yield indistinguishable observations. Resistance is a quantitative bound on leakage. These are not interchangeable. LOMAC supplies integrity (no write-up after a low read), not emanation secrecy. POSIX MAC does not supply observational equivalence with respect to O.`;

export const DERIVATION = `freebsd-mac-grok ships three skills. freebsd-mac-lomac writes roles as pw(8) groups, the official PLM, Xorg and /dev overlays, PREINSTALL uninstall. freebsd-mac-generic writes orthogonal modules (seeotheruids by default). freebsd-mac is the umbrella: zfs snapshot -r (filesystems and zvols) and optional zpool-checkpoint(8) before and after staging. No bectl(8). Sibling max-headroom-grok installs the agent wrapper; sandbox subjects are where agents live.

pqfreebsd does not replace those packages. It interviews, then emits a result directory that composes them and adds two morphisms. pqledger: an append-only, hash-chained dataset labeled high, fed by audit(4) and by policy events. pqdac: a restricted specfile, first-match like setfsmac, with oneestablish, testdrift, onerepair, and optional ugidfw generation. test* before one*. Never kldload until a test window. Recovery remains PREINSTALL plus the recursive snap.

Held, required, not this pass: pqconfirm — subject-visible confirmation that the bits read are the bits written, to the extent of a hash. pqcode — authentication of kernel, kld, policy, and emitted scripts with ML-DSA and SLH-DSA. pqzfs — the store: sha512 not fletcher, send-stream signatures, wrapping keys that are not RSA. mac-sebsd — FLASK/TE, which is unsigned code-equivalent until pqcode exists.`;
