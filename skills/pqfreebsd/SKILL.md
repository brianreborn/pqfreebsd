---
name: pqfreebsd
description: >
  Post-quantum FreeBSD access control: compose freebsd-mac-grok (mac_lomac
  integrity, orthogonal modules, ZFS snapshot -r) and layer a filesystem
  Integrity Evidence ledger plus dynamically established and repaired DAC.
  Use when the user wants /pqfreebsd, pqac, audit ledger, DAC repair,
  ugidfw generated from a spec, or “post-quantum access control” that is
  not PQC in the kernel. Payload confirmation (pqconfirm / T10) is
  required of the system and is not implemented in this skill.
---

# pqfreebsd

Read `README.md` and `man/man7/pqac.7` first, then `man/man7/pqfreebsd.7`.
This skill **derives from** freebsd-mac-grok. Also load **freebsd-mac**,
**freebsd-mac-lomac**, and **freebsd-mac-generic** when those pieces run.
Do not vendor their rc.d; compose them.

`${SKILL_DIR}` = this skill directory.

T1 and T2 are the parent packages (quantum-adversary-stable mediation, not
Kyber). This skill adds T6–T9: restricted A_D with establish/repair, and
Anderson verifiability as a hash-chained filesystem ledger.

**Held, required, not this skill:** T10 / `pqconfirm` — the data itself must
have integrity that can be confirmed, to a certain extent (content digest or
Merkle of the labeled store, bound to a ledger checkpoint). T11 / `pqcode` and
`pqzfs` — authentication of *code* (kernel, kld, pkg, policy, zfs send), not
of credentials, with two independent signature families (ML-DSA and SLH-DSA).
Do not implement these as a side quest inside `/pqfreebsd`. Do not claim ZFS
scrub, RAID-Z, or pkg RSA discharges them. If the user asks for payload
confirmation or PQ code signing, say it is the next skill and stop.

## Output

Result `~/pqfreebsd/`:

1. Copy `scripts/pqfreebsd`, `scripts/pqledger`, `scripts/pqdac` (0755),
   this `README.md` (**keep** § Known issues), and `man/` (4, 5, 7, 8,
   including `pqac.7` and `pqfreebsd.7`).
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
5. `onestart` (kldload, `enabled=0`), `pqledger onestage`, `pqdac oneestablish`,
   parent `onelabel` / `onechecklabels`.
6. `oneenforce` only if they ask; walk Gotchas **and** Known issues **and**
   pqac(7) PRAXIS first. Console.
7. Recover: `oneuninstall` then optional `zfs rollback -r pool@pqfreebsd-pre-…`.

Never `kldload` **mac_lomac(4)** or set `security.mac.lomac.enabled=1` in the
interview phase. `test*` immediately before each `one*`.

## Interview (required)

Ask, in order. Record in `POLICY`.

1. Compose parent LOMAC? Default yes. Official PLM, root `equal(equal-equal)`,
   trusted `high(low-high)`, sandbox `lomac/10[2]`, homes `/home/.*` low.
2. Orthogonal: **mac_seeotheruids(4)** only, exempt GID 0. Do not stack Biba/MLS.
   Do not enable **mac_ifoff(4)** blindly.
3. Trusted group name and members. Sandbox group name and members.
   `DEFAULT_ROLE=sandbox`.
4. Ledger dataset (default `zroot/pq/ledger`). Label `lomac/high`. Hash
   SHA-512 on the host (workbench may show SHA-256). Source: audit(4) + vnode
   + policy morphisms. Rotation appends a checkpoint record; rewrite is a bug.
5. A_D morphism: `observe` / `repair` (default) / `prevent`. prevent generates
   **ugidfw(8)** from the same spec — walk empty-ruleset and new-user-reload.
6. Confirm they know `oneuninstall` is behavior restore, not wipe, not rewind.
7. Confirm they know T10 / payload confirmation is **required of the system
   and not implemented here**.
8. Confirm they know T11 / code authentication (pkg RSA, unsigned kld, unsigned
   zfs send) is **required and not implemented here**.
9. **Bootloader gate (default no).** Ask: are they sufficiently satisfied that
   the system is post-quantum hardened to the degree that gives them a sense of
   security? Only if yes: offer `oneboot` — splash name becomes pqfreebsd, beastie
   replaced by the shield (armor of God), loader taken off unsigned GENERIC only
   as far as keys exist. **TPM / measured boot is not this pass.** If no, leave
   the stock splash. Do not rebrand a box they do not yet trust.
10. After install: `oneaudit` shows consistency among POLICY, SUITE, DAC, ugidfw,
    login labels, overlay, splash. `onepropagate` applies a change through all of
    them and appends a chained catalog hash (`policy.revs` + ledger). `test*` first.
    An audit that cannot show the kv-diff of successive iterations is not an audit.

## Checkpoint (required)

After creating or finishing a **main module** or a **freebsd-mac skill** at
top-level, checkpoint to git (and GitHub when `origin` exists):

```sh
sh scripts/checkpoint.sh "milestone: <name> — <what landed>"
```

Do not skip this. Add new MAC skills as **top-level git submodules**, like
`vendor/freebsd-mac-grok`, only after the operator names the skill.

Do not invent compartments, extra grades, or a quantum ISA.

## Apply

Root, via **service(8)** `one*` (enable defaults to NO):

1. `oneinstall` — copy into `/usr/local`
2. Offer `onesnapshot`
3. `onestage` — PREINSTALL once, never overwrite; parent stage; create ledger
   dataset if missing; install specfiles
4. `onesnapshot_after`
5. `onestart` — load modules, `enabled=0`
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
