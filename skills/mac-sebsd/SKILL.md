---
name: mac-sebsd
description: >
  Security-Enhanced BSD: FLASK/Type Enforcement as a TrustedBSD MAC module.
  Same rc.d texture as freebsd-mac-lomac (PREINSTALL, login classes, pw groups,
  test*/one*, setfsmac). Reuses LOMAC groups; labels are TE types, not grades.
  No sebsd.ko in GENERIC 14/15. Use when the user wants /mac-sebsd or TE.
---

# mac-sebsd

Same **package shape** as **freebsd-mac-lomac**. Different **axiom**: Type
Enforcement, not the integrity lattice. Do not invent `mac-rbac`.

Read `README.md` first. Papers (not in the base install):
[Security-Enhanced BSD](http://www.trustedbsd.org/sebsd-july2003.pdf)
(Vance & Watson, NAI Labs, 2003),
[sebsd.html](http://www.trustedbsd.org/sebsd.html),
[github.com/TrustedBSD/sebsd](https://github.com/TrustedBSD/sebsd).

`${SKILL_DIR}` = this skill directory.

## Reuse LOMAC

If **mac_lomac_grok** is installed, ingest
`/usr/local/etc/mac_lomac_grok/POLICY` for `TRUSTED_GROUP`, `SANDBOX_GROUP`,
and login classes. Do **not** create a second pair of groups. TE types attach
to those same roles. Composed `login.conf(5)` labels look like
`lomac/high(low-high),sebsd/staff_t` — two slots, one subject.

Snapshots: skip here when the umbrella already snapped
(`MAC_LOMAC_GROK_SKIP_SNAPSHOT=1` or `MAC_SEBSD_GROK_SKIP_SNAPSHOT=1`).

## Status (kld)

| | |
| --- | --- |
| In GENERIC 14/15? | **No.** |
| Last tree | **2006-07-05**, 7.0-SEBSD. |
| `onestart` / `oneenforce` | Refused unless `SEBSD_KLD` is a file built for this kernel, with a date. |

`test*` still runs. Stage, groups, and contexts install without a module.

## Interview

1. This is TE, not high-integrity / low-integrity.
2. Reuse LOMAC groups? Default **yes**.
3. Types (defaults): root `sebsd/sysadm_t`, trusted `sebsd/staff_t`, sandbox
   `sebsd/user_t`. These are names, not a lattice.
4. `SEBSD_KLD` / `SEBSD_DATE` / `SEBSD_BUILT_FOR` — empty means catalog only.
5. Do not compile a 2006 tree against 15 unless they name that work.

## Output

Result `~/mac-sebsd/`:

1. `README.md` (**keep** Known issues).
2. `scripts/mac_sebsd_grok` (0755) — **same extra_commands as mac_lomac_grok**.
3. `references/sebsd-policy.contexts` → `$RESULT`.
4. `POLICY` (groups from LOMAC if reuse; TE types; `SEBSD_KLD=`).
5. `man/` (4, 5, 7, 8).

Then `sudo $RESULT/mac_sebsd_grok oneinstall` && `onestage`.
`onestart` / `oneenforce` refuse without a kernel-matched kld.
`test*` immediately before each `one*`.

## Apply

Same order as LOMAC: install → (umbrella snapshot) → stage → update →
start (gated) → label (gated) → checklabels → enforce (gated) → uninstall
restores PREINSTALL.

Never `kldload` a guessed `.ko` in the interview.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
