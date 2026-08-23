---
name: freebsd-mac-base
description: >
  Configure MAC modules that a base FreeBSD GENERIC kernel (options MAC)
  actually ships: mac_seeotheruids(4), mac_portacl(4), mac_bsdextended(4)/ugidfw,
  mac_ifoff(4), mac_ipacl(4), mac_partition(4), mac_do(4), mac_priority(4).
  Not LOMAC (freebsd-mac-lomac), not SEBSD, not ipfw. Use when the user wants
  /freebsd-mac-base, seeotheruids, portacl, ugidfw, or "what's in GENERIC".
---

# freebsd-mac-base

Read `README.md` and `references/catalog.md` first.

This skill is **what GENERIC already has**. Old name: freebsd-mac-generic
(parent repo). Prefer this name. Do not invent extra `.ko`.

It is **not** **mac_lomac(4)** (use **freebsd-mac-lomac**). It is **not**
SEBSD (use **mac-sebsd**, which will refuse kldload unless a kernel-matched
module exists). It does **not** snapshot ZFS (use **freebsd-mac** / **pqfreebsd**).
It is **not** ipfw (saved last).

`${SKILL_DIR}` = this skill directory.

## Output

Result `~/freebsd-mac-base/`:

1. Copy `README.md` (**keep** § Known issues).
2. Copy `references/catalog.md`.
3. Copy `scripts/mac_base_grok` (0755) and `man/` (4, 5, 8).
4. Write `$RESULT/POLICIES` — one GENERIC module name per line, no `mac_` prefix
   (default: `seeotheruids`).
5. Write `$RESULT/POLICY` knobs (`SEEOTHERUIDS_EXEMPT_GID=0`, portacl rules if asked).

Then `sudo $RESULT/mac_base_grok oneinstall` && `onestage`. No kldload until
`onestart` or reboot. `test*` immediately before each `one*`.

If **pqfreebsd** already composed parent generic, do not install two rc.d that
kldload the same `.ko`. One loader block.

## Interview

1. Which **base** modules? Default: **mac_seeotheruids(4)** only.
2. Exempt GID (default `0` = `wheel`). One GID; no list.
3. **mac_portacl(4)**? Default no. If yes: uid/gid bind rules. Walk reserved
   portrange. This is bind, not packets.
4. **mac_bsdextended(4)** / ugidfw? Usually **pqdac prevent** already generates
   that. Do not enable an empty ruleset and call it a firewall.
5. **mac_ifoff(4)**: refuse blindly on a remote box (cuts SSH).
6. **mac_partition(4)** needs labels — prefer seeotheruids.
7. Never add **mac_biba(4)** / **mac_mls(4)** unless they insist.
8. Never add sebsd or ipfw here.

## Apply

`oneinstall` → `onestage` (PREINSTALL, marked **loader.conf(5)**) → `onestart`
loads klds (`enabled` per POLICY) → `oneuninstall` restores PREINSTALL.

If invoked from **pqfreebsd** / **freebsd-mac**, parent already snapped.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License — see the
repository root LICENSE and NOTICE.md.
