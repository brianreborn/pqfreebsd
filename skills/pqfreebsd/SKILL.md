---
name: pqfreebsd
description: >
  Post-quantum trusted FreeBSD (motto: pq all the things): compose freebsd-mac-grok (mac_lomac
  integrity, orthogonal modules, ZFS snapshot -r) and layer a filesystem
  Integrity Evidence ledger, dynamically established and repaired DAC,
  successive policy audit, and a loader gated on attestation. Use when the user
  wants /pqfreebsd, pqac, audit ledger, DAC repair, oneaudit/onepropagate,
  or a trusted base that is not PQC in the kernel. Payload confirmation
  (pqconfirm / T10) remains required of a later cut. pqcode (T11) is held,
  open-ended, and not a 1.0 requirement.
---

# pqfreebsd

Read `README.md` and `man/man7/pqac.7` first, then `man/man7/pqfreebsd.7`.
This skill **derives from** freebsd-mac-grok. Also load **freebsd-mac**,
**freebsd-mac-lomac**, and **freebsd-mac-base** (GENERIC `options MAC` modules;
old name freebsd-mac-generic) when those pieces run.
**freebsd-capsicum** (GENERIC `cap_enter`; agents must enter; not MAC).
Do not vendor their rc.d; compose them.

The kernel access-control this suite composes is the **TrustedBSD MAC
Framework** (Watson et al.), not a private monitor. Papers **not in the
base install**: http://www.trustedbsd.org/docs.html — especially
[USENIX ATC 2003](http://www.trustedbsd.org/trustedbsd-usenix2003freenix.pdf),
[DISCEX III 2003](http://www.trustedbsd.org/trustedbsd-discex3.pdf),
[SEBSD](http://www.trustedbsd.org/sebsd-july2003.pdf),
[UCAM-CL-TR-818](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-818.pdf),
[CACM 2013](https://queue.acm.org/detail.cfm?id=2436814).
Project: http://www.trustedbsd.org/  MAC: http://www.trustedbsd.org/mac.html
SEBSD: [sebsd.html](http://www.trustedbsd.org/sebsd.html) — last tree 7.0-SEBSD 2006-07-05; **mac-sebsd** refuses kldload on GENERIC.
OpenBSM: http://www.trustedbsd.org/audit.html

`${SKILL_DIR}` = this skill directory.

T1 and T2 are the parent packages (quantum-adversary-stable mediation, not
Kyber). This skill adds T6–T9: restricted A_D with establish/repair, and
Anderson verifiability as a hash-chained filesystem ledger.

**Held, required of a later cut, not this skill:** T10 / `pqconfirm`.
**Held, open-ended, not a 1.0 requirement:** T11 / `pqcode` — authentication
of *code* (kernel, kld, pkg, policy), not of credentials, with two independent
signature families (ML-DSA and SLH-DSA). Catalog the hops. Do not claim the
chain is unbroken. Do not implement pqcode as a side quest inside `/pqfreebsd`.
If the user names pqcode, cut that skill then. `pqzfs` waits until named.
**mac-sebsd** is cut as a catalog: no `.ko` in GENERIC; do not kldload.

## Install continuity (test host)

The try-out machine is **half-installed** with this skill; progress stopped on
the ZFS `MNT_MULTILABEL` blocker. After [pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel)
clears that path, **continue the interrupted `one*` order** — see repository
root `RELEASE_NOTES.md`. Do not assume a green-field re-interview unless
`PREINSTALL` / snapshots demand it.

## pqfreebsd_kernel (only the skeleton is always required)

**https://github.com/brianreborn/pqfreebsd_kernel**

| | |
| --- | --- |
| **Always required** | `pqfreebsd.ko` — skeletal core today (`security.pqfreebsd.enforcement` / `.audit`; kernel messages on change). Will become **extremely critical**: clean path to lock down kernels **without modifying FreeBSD source**. |
| **As needed to enable** | Any number of sibling `pqfreebsd_*` KLDs. The suite may need several for a full enablement path; none are required merely to have the core. |

The core **does not** load siblings. Userland does. **pqk** is **not
LLM-dependent** — do not vendor or build it on demand from **pqf skills** /
create-skill bits. Do not treat the core’s current size as a sign it is
disposable — it is the permanent in-kernel foothold.

**ZFS-only enablement sibling (mid-install blocker on ZFS):** ZFS does not set
`MNT_MULTILABEL`. Legacy **UFS/FFS** already does — it predates ZFS and never
had this regression — so a non-ZFS host does **not** need
`pqfreebsd_compat_zfs_multilabel`. On ZFS, that KLD papers over the trivial
bug until a proper fix goes upstream. Do not flip dataset `xattr=` to “fix”
LOMAC (pqac(7)). Do not interview the operator about hand-`kldload`.

**Agent / suite duty:** **pqk is ideally preloaded by loader(8)**
(`pqfreebsd_load="YES"` in `/boot/loader.conf.local`, plus ZFS compat when
ZFS is in play). install/stage/start ensure those lines and `kldload` only
as a same-session fallback until reboot. Missing optional `.ko` does not
fail start; `setfmac` `EINVAL` on ZFS means install that compat and reboot
or re-`start`. Abort with `enabled=0` if `EINVAL` persists (probe `/tmp`
as in pqac(7)).

## Output

Result `~/pqfreebsd/`:

1. Copy `scripts/pqfreebsd`, `scripts/pqledger`, `scripts/pqdac` (0755),
   this `README.md` (**keep** § Known issues), `man/` (4, 5, 7, 8,
   including `pqac.7` and `pqfreebsd.7`), and `boot/*.4th` (logo + brand).
2. Write `POLICY`, `SUITE`, `dac.contexts`, `ledger.conf` from the interview.
3. If parent skills are present, run **freebsd-mac** into the same result
   tree with `MAC_LOMAC_GROK_SKIP_SNAPSHOT=1` after **this** umbrella has
   offered `onesnapshot`. Do not let children snapshot.
4. `sudo $RESULT/pqfreebsd oneinstall`.

## Order (strict)

1. Interview (below). Roles are **pw(8)** groups. Reconfirm; do not assume ruach.
2. **Offer** `onesnapshot` (**zfs snapshot -r** on the root pool — filesystems
   and zvols; `CHECKPOINT=1` only if they accept pool rewind). Before any `onestage`.
3. `onestage` — PREINSTALL, parent children, ledger dataset, DAC spec installed
   not yet applied.
4. **Offer** `onesnapshot_after`.
5. `start` / `onestart` (KLDs already loaded on install/stage/boot; start
   loads parent children), `enabled=0`. Then `pqledger onestage`,
   `pqdac oneestablish`, parent `onelabel` / `onechecklabels`.
6. `oneenforce` only if they ask; walk Gotchas **and** Known issues **and**
   pqac(7) PRAXIS first. Console.
7. Recover: `oneuninstall` then optional `zfs rollback -r pool@pqfreebsd-pre-…`.

Never `kldload` **mac_lomac(4)** or set `security.mac.lomac.enabled=1` in the
interview phase. `test*` immediately before each `one*`.

## Interview (required)

Ask, in order. Record in `POLICY`.

1. Compose parent mac_lomac(4)? Default yes. Speak **high-integrity** and
   **low-integrity** to the operator (kernel still writes `lomac/high` and
   `lomac/low`). Official policy: OS files high-integrity, home directories
   low-integrity, root exempt (not contained). High-integrity role starts at
   `high(low-high)`; low-integrity role at `lomac/10[2]`.
2. Capsicum: low-integrity agents **must** `cap_enter` (default yes). GENERIC,
   not a kld. First pass `pqcap-enter`, not Casper. Do not wrap sshd/login.
   Independent of the lattice (T18, T19).
3. Base GENERIC modules: **mac_seeotheruids(4)** only by default, exempt GID 0.
   Optional **mac_portacl(4)** (bind, not packets). Do not stack Biba/MLS.
   Do not enable **mac_ifoff(4)** blindly. ipfw uid/gid is not this interview
   (saved last; would start ugidfw-shaped).
3. High-integrity group name and members (humans who may start able to write
   OS files). Low-integrity group name and members (agents, builders, guests).
   New users default to the low-integrity role.
4. Ledger dataset (default `zroot/pq/ledger`). Label **high-integrity**. Hash
   SHA-512 on the host (workbench may show SHA-256). Source: audit(4) + vnode
   + policy morphisms. Rotation appends a checkpoint record; rewrite is a bug.
5. A_D morphism: `observe` / `repair` (default) / `prevent`. prevent generates
   **ugidfw(8)** from the same spec — walk empty-ruleset and new-user-reload.
6. Confirm they know `oneuninstall` is behavior restore, not wipe, not rewind.
7. Confirm they know T10 / payload confirmation is **required of the system
   and not implemented here**.
8. Confirm they know T11 / pqcode is **catalogued, open-ended, and not a 1.0
   requirement**. T15: the hops are listed; this pass does not claim the chain
   is unbroken. Do not pretend pkg RSA discharges origin.
12. **Beta-end bounds (T16).** The work is not done until each remaining claim
    has a parameterized bound: what it proves, where it stops, classical bits
    (or n/a), qubit BQP, qudit / non-binary quantum, and CVQC. Fill the sheet
    as modules land. Do not emit “provably secure” as a slogan.
9. **Loader gate (default no).** Ask: are they sufficiently satisfied that
   the system is post-quantum hardened to the degree that gives them a sense of
   security? Only if yes: offer `oneboot` — take the loader off unsigned
   GENERIC only as far as keys exist. **TPM / measured boot is not this pass.**
   Splash art is cosmetic (cross default). If no, leave the stock loader.
   Do not rebrand a box they do not yet trust.
10. After install: `oneaudit` shows consistency among POLICY, SUITE, DAC, ugidfw,
    login labels, overlay, splash. `onepropagate` applies a change through all of
    them and appends a chained catalog hash (`policy.revs` + ledger). `test*` first.
    An audit that cannot show the kv-diff of successive iterations is not an audit.
11. **Off-host IE (default no).** Is there a second host that will store and
    validate the ledger? If yes: include the replica protocol, name the peer.
    If the box is later network-stranded and cannot securely transport the chain,
    **that claim degrades; mediation and local IE do not.** A deployment that
    includes and enables the module and adheres to it keeps the claim. Silent
    (not included) is not degraded. Do not report the suite as a single bit (T14).

## Checkpoint (required)

After creating or finishing a **main module** or a **freebsd-mac skill** at
top-level, checkpoint to git (and GitHub when `origin` exists):

```sh
sh scripts/checkpoint.sh "milestone: <name> — <what landed>"
```

Do not skip this. Add new MAC skills as **top-level git submodules**, like
`vendor/freebsd-mac-grok`, only after the operator names the skill.
Do **not** invent `mac-rbac` that wraps LOMAC and SEBSD. One skill per
proof: lattice stays parent lomac; GENERIC `.ko` are **freebsd-mac-base**;
SEBSD is **mac-sebsd** (TE catalog; kldload refused on stock). ipfw is last.

## Port (after the skills exist)

In-tree FreeBSD port: `ports/sysutils/pqfreebsd`. Intended install path once
the skills are developed. Requires a sufficiently advanced LLM that can
operate those skills. `pqfreebsd-llm-check` then `sysrc pqfreebsd_llm_attested=YES`.
via-port `oneenforce` is refused without that conjunct. The port does not
kldload. Copy the directory to `/usr/ports/sysutils/pqfreebsd`.

Do not invent compartments, extra grades, or a quantum ISA.

## Apply

Root, via **service(8)** `one*` (enable defaults to NO):

1. `oneinstall` — copy into `/usr/local`
2. Offer `onesnapshot`
3. `onestage` — PREINSTALL once, never overwrite; parent stage; create ledger
   dataset if missing; install specfiles
4. `onesnapshot_after`
5. `start` / `onestart` — pqk ideally already loader-preloaded; fallback
   kldload if needed; `enabled=0`
6. `pqledger` `onestage` / `oneverify`
7. `pqdac` `oneestablish` / `testdrift` / `onerepair`
8. parent `onelabel` / `onechecklabels`
9. `oneenforce` only if they ask
10. `oneuninstall` — PREINSTALL; keep snaps and ledger dataset

Privilege: one sudo. Never ask “continue?”

## After

Point at `$RESULT`. Leave README § Known issues intact. If Headroom /
**max-headroom** is in play, sandbox subjects are where agents live — do not
skip to `oneenforce` to “help” an agent.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License — see the
repository root LICENSE and NOTICE.md. This product includes software
developed by Brian Fundakowski Feldman.
