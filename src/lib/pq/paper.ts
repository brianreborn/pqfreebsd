export type Thesis = {
  id: string;
  title: string;
  body: string;
  kind: "inherited" | "pqfreebsd" | "held";
};

export const MOTTO = "pq all the things";

export const ABSTRACT = `We describe PQFreeBSD, a composition of mandatory and discretionary controls on FreeBSD: integrity labels, Type Enforcement when a module exists, capability mode, a restricted and repaired access matrix, Integrity Evidence, successive policy as an object, and confinement of low-integrity agents. Several of these are mandatory in the ordinary sense — the subject cannot elect them away. Some load as modules of the TrustedBSD MAC Framework; some do not (Capsicum is GENERIC capability mode; repaired A_D is userland plus optional ugidfw). The Framework is not the only MAC in the suite, and MAC is not only the Framework.

The work inherits pqac(7): authorization on a von Neumann FreeBSD defender is not an instance of a BQP-hard naming problem. That is not a claim that the TCB is post-quantum. Cryptographic hops that remain RSA or ECC have no post-quantum resistance at those hops.

Two lemmas we defend: unlike layers do not inherit a namei TOCTOU, and the min-cut of an unlike-connected Integrity Evidence federation is extra virtual dimensions of channel security. Independent reductions unshare alike data. Copies of the same reduction do not count.`;

export const INTRODUCTION = `FreeBSD already ships several trusted-OS mechanisms, many of them from the TrustedBSD Project (MAC Framework in 5.0, OpenBSM, Capsicum in 9). They are in GENERIC. Man pages name them; the design papers are not in the base install.

pqac(7) asked whether a BQP adversary thereby obtains a write the reference monitor would accept. It does not, unless it can induce a classical state the hooks accept. Mediation is an interpreted predicate, not a cryptographic game.

That answer is incomplete as a trusted-base story. Verifiability is not supplied by loading one module. The residual matrix is unrestricted unless specified and repaired. Agents retain the ambient namespace unless they cap_enter. Code the monitor will run is often named by RSA, or not named. Stacking self-similar checks duplicates namei; stacking unlike checks does not.

PQFreeBSD packages those gaps. pqac(7) remains T1–T5. This paper is the systems account, including two lemmas (T20, T21) and a Capsicum agent contract (directory fd before enter).`;

export const BACKGROUND = `Mandatory policy in this suite is not a single module. Integrity labels (mac_lomac(4)), file-firewall rules (mac_bsdextended / ugidfw), port and IP ACLs, seeotheruids, and Type Enforcement (SEBSD, when a kernel-matched kld exists) all load through the TrustedBSD MAC Framework — a common hook table, not one axiom. Capsicum is mandatory once entered and is not a MAC module. A repaired A_D spec is mandatory in prevent mode. pqk (skeletal pqfreebsd.ko, loader-preloaded when possible) is a separate, non-LLM kernel tree.

mac_lomac(4) is the integrity policy we compose by default: floating labels, low-watermark. We say high-integrity and low-integrity; the kernel still stores lomac/high and lomac/low.

Capsicum (Watson, Anderson, Laurie, Kennaway, USENIX Security 2010) is capability mode in GENERIC. After cap_enter, a process operates on descriptors it already holds. This cut’s agent contract is pqcap-enter --root: a rights-limited directory fd (PQCAP_ROOTFD=3) opened before enter; the child uses openat.

OpenBSM / audit(4) is the in-band event source. The Integrity Evidence ledger is a hash-chained high-integrity object derived from those events, not a replacement for /var/audit.

SEBSD (Vance and Watson, NAI Labs 2003) is FLASK/TE as a Framework module. The last published tree is 7.0-SEBSD, 2006-07-05. There is no mac_sebsd.ko in GENERIC 14/15. The skill reuses LOMAC’s rc.d texture and groups; types compose into the same login class, not a second lattice.`;

export const THREAT = `The defender is a classical stored-program FreeBSD host, GENERIC, options MAC and CAPABILITY_MODE. The adversary has polynomial-time quantum algorithms on the usual public-key names (Shor) and Grover search over unstructured domains, and, as a working hypothesis inherited from pqac(7), an instrument on the electrical plant. The adversary is not assumed to execute a quantum ISA on the defender.

T1–T5 are stated in full in pqac(7). We inherit them. If the observation function on the plant does not factor through a kernel-visible subject, mediation is silent and the property is physical. This paper does not claim Faraday cages.`;

export const THESES: Thesis[] = [
  {
    id: "T1",
    kind: "inherited",
    title: "BQP does not write the vnode",
    body: "Membership in BQP does not by itself produce a classical write accepted by the reference monitor. A quantum adversary who would act as a subject must still induce a classical state the hooks accept. Stated in pqac(7).",
  },
  {
    id: "T2",
    kind: "inherited",
    title: "Mediation is not a cryptographic game",
    body: "A_D, A_M, and MMU translation are quantum-adversary-stable on a von Neumann defender. They are post-quantum access control in that sense, and not post-quantum cryptography. Shor destroys A_auth when A_auth is RSA or ECC. It does not inhabit chmod or a high-integrity label. Stated in pqac(7).",
  },
  {
    id: "T3",
    kind: "inherited",
    title: "The plant may still distinguish",
    body: "Working hypothesis: some instrument on the plant, possibly entanglement-enhanced, can distinguish defender computation. This is not a corollary of Shor. Decoherence, placement, and GENERIC noise remain the adversary's burden. Stated in pqac(7).",
  },
  {
    id: "T4",
    kind: "inherited",
    title: "Factor the observation, or fall silent",
    body: "If the observation function O factors through a kernel-visible subject, T1 and T2 constrain O. If not, they are silent. POSIX MAC does not supply observational equivalence with respect to O. Stated in pqac(7).",
  },
  {
    id: "T5",
    kind: "inherited",
    title: "Quantum advantage on the plant is not free",
    body: "Quantum advantage on the plant is not a lemma from BQP. T5 keeps T3 from swallowing T1 and T2. Stated in pqac(7).",
  },
  {
    id: "T6",
    kind: "pqfreebsd",
    title: "A restricted discretionary specification is required",
    body: "Harrison, Ruzzo and Ullman showed that safety for an unrestricted discretionary matrix is undecidable. We do not solve HRU. We specify a restricted language (path regular expressions to owner, group, mode, and inheritance) and a morphism that restores the specification when the live matrix drifts. Residual owner-directed chmod remains; repair bounds its duration. Optional prevention is mac_bsdextended(4) generated from the same specification — a different module, a different proof. This does not turn A_D into A_M.",
  },
  {
    id: "T7",
    kind: "pqfreebsd",
    title: "Verifiability is recorded as Integrity Evidence",
    body: "Anderson required complete mediation, isolation, and verifiability. The first two are approximated by the MAC Framework and mac_lomac(4). The third is not a property of loading a module. We record vnode, label, and policy-morphism events in an append-only, hash-chained filesystem object on a high-integrity dataset. Tampering with the chain is a collision problem against the hash (production SHA-512; Grover halves the bits). That is authentication of the evidence, not of the subject. The BSM trail remains the in-band source; the chain is not /var/audit.",
  },
  {
    id: "T8",
    kind: "pqfreebsd",
    title: "Establishment and repair are morphisms",
    body: "New objects inherit A_D from the specification at create time. Repair restores intended A_D when actual differs. setfsmac(8) first-match and the DAC specfile use the same combinator; they are not lattice joins. Conjunction with A_M is still not a product of proofs (pqac(7)).",
  },
  {
    id: "T9",
    kind: "pqfreebsd",
    title: "The ledger writer is a subject",
    body: "If O factors through the process that appends to the chain, T4 applies. The ledger is not a Faraday cage, not a retrofit of A_auth, and not a secrecy lattice. mac_lomac(4) will not mute emanations of what a high-integrity subject was allowed to compute. Recovery (PREINSTALL, recursive ZFS snapshot) remains inside the isolation claim: a lockout is a failed interpretation, not successful confinement.",
  },
  {
    id: "T10",
    kind: "held",
    title: "Payload integrity is confirmable only with a bound digest",
    body: "A_M constrains who may write. The ledger records that a write occurred. Neither, by itself, lets a later subject confirm that the bits they read are the bits that were written. ZFS checksums detect silent corruption inside the pool; they are not a subject-visible confirmation API. A content digest — a Merkle tree over the labeled store, or a per-object hash bound at a ledger checkpoint — is confirmable to the extent of the hash. Required of a later cut (pqconfirm). Not implemented here.",
  },
  {
    id: "T11",
    kind: "held",
    title: "Code the monitor interprets must be authenticated",
    body: "A monitor that is stable under BQP and that interprets RSA-signed or unsigned inputs will correctly enforce a forged policy. Kernel, klds, pkg(8), freebsd-update, setfsmac policy, zfs send, and the rc.d this suite emits are code or code-shaped. Authentication here is of code, not of login credentials. Any cryptographic layer that is still RSA or ECC has no post-quantum resistance at that layer. Independent surfaces around it (T19) do not upgrade it. Resistance at a hop requires that hop to use post-quantum algorithms. Redundancy, when implemented, is two independent reductions: ML-DSA (FIPS 204, lattices) and SLH-DSA (FIPS 205, hashes). A break of one family is not a break of the other. Fletcher, RAID-Z, AES-at-rest, and a second RSA key are not a second family. pqcode is held and is not a 1.0 requirement. The catalog of hops remains. We do not claim the chain is unbroken.",
  },
  {
    id: "T12",
    kind: "held",
    title: "The loader remains GENERIC until the operator attests",
    body: "oneboot is refused until the operator attests they are satisfied that the system is post-quantum hardened to the degree that gives them a sense of security. Default is no. The claim is the gate: we do not take the loader off the unsigned GENERIC path until that attestation, and only as far as this pass can close. TPM and measured boot are not this pass. Cosmetic loader marks are a consequence of attestation, not a security argument.",
  },
  {
    id: "T13",
    kind: "pqfreebsd",
    title: "Successive policy is an auditable object",
    body: "POLICY, SUITE, the DAC spec, ugidfw, login classes, MAC overlays, and loader configuration must be checkable for consistency, changeable in one propagation, and diffable across revisions. Each propagation is a named revision whose catalog hash is chained (previous catalog) and recorded in the ledger. Consistency is a predicate over that conjunction, not a product of the component proofs. An audit that cannot show what changed is not an audit.",
  },
  {
    id: "T14",
    kind: "pqfreebsd",
    title: "Claims degrade by conjunct",
    body: "A missing or stranded protocol weakens only the claims that named it. If Integrity Evidence cannot be transported to a second host and validated there, the off-host IE claim is degraded. High-integrity overwrite protection, the local chain, repaired A_D, successive policy, Capsicum confinement, and the loader gate are not thereby false. Silent (module not included) is distinct from degraded (module included, protocol unmet). Inverse of the pqac(7) observation that conjunction is not a product of proofs. Dual, T19: for the adversary, independent surfaces do not fall together.",
  },
  {
    id: "T19",
    kind: "pqfreebsd",
    title: "Independent reductions raise adversary cost; they do not multiply proofs",
    body: "A quantum algorithm attacks a class of problem. Shor solves period-finding on the groups used by RSA and ECC. Grover gives a square-root speedup on unstructured search. Neither is a write the MAC Framework accepts. Neither opens a path after cap_enter. A cryptanalytic break of module lattices is not a break of hash-based signatures. Redundancy in this suite means independent reductions, not copies of the same one: ML-DSA and SLH-DSA are two families; LOMAC, Capsicum, repaired A_D, and the Integrity Evidence chain are four predicates. Two RSA keys, RAID-Z, and a hybrid where either half suffices are not independent — those collapse together. Homogeneous copies share a layout: they hit the same cache lines, the same vnode cache, the same reduction. Variation of data structure unshares alike semantic data (a lattice label is not a capability bitmap is not a hash-chain record is not a hash-based signature). That is an inefficiency — larger working set, no shared fill, no common-subexpression for the attacker. It is why this redundancy is the valuable kind: an exploit or an algorithm that has learned one representation does not find the others already in cache. For the defender, conjunction is not a product of proofs (pqac(7), T14). For the adversary, each independent surface must be attacked; cost approaches a product only then. T19 does not confer post-quantum resistance on a cryptographic hop that has not been upgraded. Resistance at that layer requires PQ algorithms at that layer (T11, T15).",
  },
  {
    id: "T15",
    kind: "held",
    title: "An unbroken chain of trust, with post-quantum particulars",
    body: "Distinct from T2. Walk firmware database, loader, kernel, kld, pkg, freebsd-update, policy, rc.d, ledger checkpoint, zfs send, replica transport. Each hop that is cryptography has no post-quantum resistance until that hop is a post-quantum algorithm: ML-DSA and SLH-DSA for signatures, ML-KEM for transport, SHA-512 or SHA-3 Grover-accounted for hashes. Surrounding independent surfaces (T19) do not upgrade an RSA or ECC hop. Hybrid (classical plus PQ) is a transition particular; Shor still forges the classical half. A classical or missing hop breaks the chain from that point down. It does not un-prove T2 (T14). This paper catalogs hops. It does not claim the chain is unbroken.",
  },
  {
    id: "T16",
    kind: "pqfreebsd",
    title: "Each remaining claim carries parameterized bounds",
    body: "At the end of beta the system is proven up to the conjunction of named bounds, and no further. Each measure states what is proven, where the proof stops, and expected resistance against classical PPT, qubit BQP, qudit and other non-binary models, and continuous-variable machines. Mediation is not a bit-security number in any of those models: the adversary still writes through the hook. Cryptographic particulars have numbers, birthday- and Grover-accounted, or an honest zero. A zero on pkg RSA does not zero high-integrity overwrite protection.",
  },
  {
    id: "T17",
    kind: "pqfreebsd",
    title: "The ports package is not the operator",
    body: "sysutils/pqfreebsd stages scripts, manuals, skills, and Forth. Intended operation is by a model that can follow those skills (interview, test before apply, known issues, this paper). The port cannot measure that. Local GPU and CPU runtimes are OPTIONS (ollama, llama.cpp, LocalAI, llamafile, vLLM, koboldcpp). Native inference on FreeBSD is CPU and Vulkan; CUDA is typically Linuxulator. Attestation (pqfreebsd_llm_attested) is a conjunct of the via-port oneenforce path, not of A_M.",
  },
  {
    id: "T18",
    kind: "pqfreebsd",
    title: "Low-integrity agents enter capability mode",
    body: "Capsicum is in GENERIC. cap_enter confines a process to the descriptors it already holds. mac_lomac(4) prevents a low-integrity process from overwriting high-integrity files; Capsicum prevents it from opening new ones. Those are independent predicates: a quantum algorithm is not a substitute for either. Agents must enter. First pass: pqcap-enter --root dir (directory fd 3, PQCAP_ROOTFD, rights-limited; child openat only). That is the namei TOCTOU close (T20). Casper is later. Missing Capsicum does not un-prove the lattice. An unwrapped agent is a missing confinement conjunct.",
  },
  {
    id: "T20",
    kind: "pqfreebsd",
    title: "Unlike layers do not inherit a namei TOCTOU",
    body: "A TOCTOU race is a change of the binding of a path p between check and use when both call namei(p). Self-similar stacking — two MAC modules, or MAC and DAC, that each re-resolve the name — duplicates that race. Boilerplate copied into every self-similar layer is the same check twice; it is not a second dimension. Capsicum after cap_enter uses the fd; namei is not called on the use (Watson, Anderson, Laurie, Kennaway, USENIX Security 2010). A MAC check on a vnode the caller already holds is a check on vp, not on p; swapping the name does not swap vp. Ledger append is an event on the object, not a second lookup. Lemma: a stacked unlike layer closes this TOCTOU iff its use does not re-resolve p. Copies of namei do not. Where the proof stops: directory rename above a held vnode, *at races, fd passing, Casper confused-deputy. We do not claim every classical race. We claim stacking unlike mechanisms is not stacking copies of lookup.",
  },
  {
    id: "T21",
    kind: "pqfreebsd",
    title: "Federation min-cut is extra virtual dimensions of channel security",
    body: "Let G=(V,E) be hosts that store or validate Integrity Evidence, with an edge only when the transport is an independent reduction (unlike keys, unlike layout — T19; not a bind-mount of the same bits). An undetected rewrite of history requires controlling a cut from the origin to every honest validator. Adding a vertex adjacent to an honest validator, or an independent edge among existing vertices, strictly increases some cut capacities. Call each independent channel a virtual dimension: not spacetime; a degree of freedom the adversary's strategy must succeed in. Size and connectivity of the federation therefore add channel dimension. They do not add bit-security to RSA. Correlated hosts (same pkg key, same admin, one network compromise) are not extra dimensions. Silent (replica not composed) is not a dimension. Stranded (composed, protocol unmet) is a lost edge (T14). Where the proof stops: we catalog the graph; we do not yet prove a numeric min-cut for a named deployment. The lemma is the shape of the bound, not a number on a box.",
  },
];

export const LEMMAS = `Lemma T20 (unlike namei). A TOCTOU on path p is inherited by a layer iff that layer re-resolves p between check and use. Capability mode after cap_enter, and MAC on a held vnode, do not. Self-similar copies of namei do. Therefore stacking unlike security mechanisms is not equivalent to stacking boilerplate in every MAC/DAC layer.

Lemma T21 (federation cut). Integrity Evidence channel security is bounded below by the min-cut of the unlike-connected host graph. Increasing size and unlike connectivity increases that cut — extra virtual dimensions of channel, not extra bits on a classical signature. Correlation collapses dimensions.

Both lemmas inherit T19 (unsharing) and T14 (conjuncts). Neither upgrades an RSA hop (T11, T15).`;

export const IMPLEMENTATION = `freebsd-mac-grok remains the parent: freebsd-mac-lomac (roles as pw(8) groups, official PLM, PREINSTALL), freebsd-mac-base (GENERIC mac(4) modules; formerly freebsd-mac-generic), and freebsd-mac (zfs snapshot -r on filesystems and zvols before and after staging). pqfreebsd interviews, then emits a result directory that composes those packages.

pqledger appends hash-chained events on a high-integrity dataset. pqdac compiles the restricted A_D spec and establish/repair (or prevent via ugidfw). pqaudit implements consistency, propagation, and chained catalog hashes. freebsd-capsicum compiles pqcap-enter on the host and requires agents to be invoked through it. mac-sebsd installs a catalog and refuses kldload unless a kernel-matched, dated module is named. It reuses the LOMAC rc.d texture (PREINSTALL, login classes, pw groups, test*/one*) and the LOMAC groups; labels are TE types composed into the same login.conf slot, not a second lattice. sysutils/pqfreebsd stages the suite; it does not kldload.

Recovery is PREINSTALL restoration of prior behavior plus the recursive snapshot. Uninstall is not wipe and not rewind. test variants exist for each apply step.`;

export const STATUS = `Implemented in this cut: T6–T9, T13, T14, T16–T21, and the loader gate (T12) as refusal-until-attestation. Inherited: T1–T5 via pqac(7) and freebsd-mac-lomac. T20–T21 are lemmas with stated stopping points, not Coq.

Held, not a 1.0 requirement: T11 / pqcode (open-ended). Held, required of a later cut: T10 / pqconfirm, authenticated zfs send (pqzfs), measured boot. SEBSD: catalog only; last tree 2006. ipfw uid/gid: deferred; first pass would follow the ugidfw shape.

The workbench in this repository is a simulation for design and interview. It is not a proof on GENERIC.`;

export const RELATED = `Anderson, Computer Security Technology Planning Study, ESD-TR-73-51, 1972. Harrison, Ruzzo, Ullman, Protection in Operating Systems, CACM 19(8), 1976. Biba, MTR-3153, 1977. Fraser, LOMAC, USENIX FREENIX 2001.

TrustedBSD papers, not in the base install, are indexed at http://www.trustedbsd.org/docs.html. We rely in particular on the MAC Framework papers (DISCEX III 2003, USENIX ATC 2003), the Capsicum paper (USENIX Security 2010), the SEBSD report (NAI Labs 2003), and Watson, UCAM-CL-TR-818, 2012.

SELinux / FLASK on Linux is the cousin of SEBSD; LSM is not the MAC Framework. We do not treat them as interchangeable.`;

export const CONCLUSION = `Authorization on GENERIC FreeBSD does not collapse under Shor. Cryptographic hops that are still RSA or ECC do. Several policies here are mandatory; only some of them are Framework modules. Unlike layers do not share a namei race. An unlike-connected federation of evidence validators adds channel dimension. That is the work we are in a position to defend.`;

/** @deprecated use INTRODUCTION / IMPLEMENTATION; kept for any leftover imports */
export const EXOTERIC = INTRODUCTION;
export const ESOTERIC = THREAT;
export const DERIVATION = IMPLEMENTATION;

export const PRAXIS = [
  {
    id: "empty",
    title: "Empty interpretation",
    body: "Enabling A_M before setfsmac(8) is a different relation: unlabeled objects versus labeled processes. Keep security.mac.lomac.enabled=0 until a setfmac probe, then setfsmac. The ledger dataset must be labeled before enforce or it is an unlabeled hole.",
  },
  {
    id: "combinators",
    title: "First-match is not least upper bound",
    body: "setfsmac(8) first-match is not LUB in the integrity lattice. DAC specfiles use the same combinator. Overlays precede the official PLM. A proof that quotes the PLM without quoting the combinator is a proof of a different policy.",
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
    body: "Untrusted ifnets default low-integrity. trust_all_interfaces is RDTUN (loader.conf), not a live sysctl. Remote-only enforce demotes or kills the authentication path.",
  },
  {
    id: "zfs",
    title: "The store is not UFS-shaped",
    body: "ZFS has no tunefs -l multilabel. Labels live in the system extattr namespace (OpenZFS freebsd:system prefix). Do not flip xattr=sa to “fix” LOMAC. Probe setfmac on /tmp; abort with enabled=0 if EINVAL persists after kldload.",
  },
  {
    id: "integrity-bug",
    title: "Integrity is experienced as EPERM",
    body: "_secure_path: unable to stat .login_conf when a high-integrity subject su's into a low-integrity home is LOMAC as specified. Root equal(equal-equal) is exemption, not containment (mac(9)).",
  },
  {
    id: "conjunction",
    title: "Orthogonal modules are separate proofs",
    body: "seeotheruids is orthogonal. ifoff other_enabled=0 denies the ifnet. ugidfw empty is allow-all; new users miss rules until reload. Biba stacked on LOMAC is a product of incompatible axioms.",
  },
  {
    id: "recovery",
    title: "Recovery is inside isolation",
    body: "A lockout is a failed interpretation, not successful confinement. PREINSTALL restores behavior. zfs snapshot -r is the dataset morphism. uninstall is not wipe and not rewind.",
  },
  {
    id: "auth",
    title: "Authentication still sits in front",
    body: "None of the above places A_auth in a BQP-hard problem. T2 is mediation after a name. Signing the code the monitor runs is T11, a different row.",
  },
  {
    id: "genesis",
    title: "Genesis is a named record",
    body: "An empty ledger is not evidence. The first record names the policy hash, the dataset, and the hash. Rotation appends a checkpoint record. Rewrite is a bug.",
  },
  {
    id: "repair-window",
    title: "Repair bounds duration, not the syscall",
    body: "chmod still succeeds in repair mode; the window is the event duration. prevent mode is mac_bsdextended generated from the same spec.",
  },
  {
    id: "payload",
    title: "Event integrity is not payload integrity",
    body: "The ledger confirms that an operation happened, in order, under a hash. It does not confirm the bytes of a home-directory file. That is T10.",
  },
  {
    id: "code-auth",
    title: "Sign the bits that run",
    body: "pkg RSA, unsigned kldload, unsigned zfs send, unsigned policy: each is A_auth of code that T2 set aside. Held for a later cut.",
  },
  {
    id: "unsharing",
    title: "Unlike layouts unshare alike data",
    body: "Two RSA signatures of the same bits share structure: cache lines, vnode pages, a single reduction. A lattice label, a capability rights mask, a hash-chain record, and an SLH-DSA signature of related facts do not. Unsharing is inefficient (working set, miss rate). That cost is why heterogeneous redundancy is worth more than another copy of the same structure: the attacker does not find the second fact already in cache. Still not a product of proofs. Still not a PQ upgrade of an RSA hop.",
  },
  {
    id: "skill-cut",
    title: "One skill per proof",
    body: "LOMAC is the integrity lattice. GENERIC modules are freebsd-mac-base. SEBSD is Type Enforcement, catalogued, not loaded on GENERIC. It reuses LOMAC's rc.d texture and groups; types are not grades. Capsicum is capability mode. Groups-as-roles is the binding, not a third axiom. ipfw uid/gid is last.",
  },
];
