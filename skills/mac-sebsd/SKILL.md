---
name: mac-sebsd
description: >
  Security-Enhanced BSD: FLASK/Type Enforcement as a TrustedBSD MAC module.
  Last published tree is FreeBSD 7.0-SEBSD (2006). There is no mac_sebsd.ko
  in GENERIC 14/15. Use when the user wants /mac-sebsd, SEBSD, or TE on FreeBSD.
  Do not kldload unless they name a kernel-matched module with a date.
---

# mac-sebsd

Read `README.md` first. Papers (not in the base install):
[Security-Enhanced BSD](http://www.trustedbsd.org/sebsd-july2003.pdf)
(Vance & Watson, NAI Labs, 2003),
[sebsd.html](http://www.trustedbsd.org/sebsd.html),
[github.com/TrustedBSD/sebsd](https://github.com/TrustedBSD/sebsd) (FreeBSD 7.0).

This is **Type Enforcement**, not LOMAC grades, not an RBAC umbrella.

## Status (do not lie)

| | |
| --- | --- |
| In GENERIC 14/15? | **No.** `kldstat -v \| grep sebsd` is empty on stock. |
| Last snapshot | **2006-07-05**, 7.0-SEBSD. [supfile](http://www.trustedbsd.org/downloads/20060705-7.0-SEBSD-supfile). |
| Framework | FLASK/TE **hooks** were largely upstreamed; the **policy module and reference policy were not**. |
| Forward-port | Site: “fairly straight forward from a FreeBSD perspective, but non-trivial effort” on FLASK/TE and a reference policy. |
| Known to work recently | **Not known.** Do not treat a 2006 `.ko` as loadable on 15.1. |

**Do not `kldload` a guessed sebsd.ko.** That is unsigned code-equivalent policy (T11) *and* likely ABI rot.

## Interview

1. Confirm they know this is TE, not high-integrity/low-integrity.
2. Ask: do they have a **sebsd.ko built for this kernel**, with a **date** and a **source tree**?
   - If **no**: write `SEBSD_KLD=` empty. Stop. Catalog only. `oneenforce` refused.
   - If **yes**: record `SEBSD_KLD`, `SEBSD_BUILT_FOR` (uname -K), `SEBSD_DATE`. Still `testkld` before any load. If `kldload` fails, that is the answer — do not force.
3. Do not compile a 2006 tree against 15 as a side quest inside this interview unless they name that work.
4. Policy language / checkpolicy: held until a module that actually loads exists.

## Output

Result `~/mac-sebsd/`:

1. Copy `README.md` (**keep** status table).
2. Write `POLICY` with the paths/dates above.
3. Copy `scripts/mac_sebsd_grok` (0755).

`onestage` installs the catalog and POLICY. `onestart` **refuses** unless `SEBSD_KLD` is a regular file and `testkld` would succeed. `oneenforce` refused while the kld is missing.

## Apply

Never in the interview: `kldload sebsd`, `kldload mac_sebsd`.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
