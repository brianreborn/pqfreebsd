# REMNANT — persist here; context was 99%

Written 2026-08-23. Next session: **read this first**, then `RELNOTES`, `USAGE.md`, `skills/freebsd-capsicum/SKILL.md`, `src/lib/pq/paper.ts` (T18–T21).

**Official name:** PQFreeBSD. **Evocative:** Free(ly)B(le)S(se)D (*Freely Blessed*). Motto: pq all the things.

**Repos**
- https://github.com/brianreborn/pqfreebsd (`main`; this tree)
- https://github.com/brianreborn/freebsd-mac-grok (submodule `vendor/freebsd-mac-grok`)
- https://github.com/brianreborn/pqfreebsd_kernel (**pqk**, not LLM-dependent, not a submodule)
- https://github.com/brianreborn/max-headroom-grok (sibling; **not composed yet**)

## Last pushed (this chat)

`07985e3` — Capsicum **build contract** (critical, keep going here):

```
pqcap-enter --root dir cmd…
```

Opens `dir` **before** `cap_enter`, `cap_rights_limit` (lookup/read/write/create/fchdir/…), dup to **fd 3**, `PQCAP_ROOTFD=3`. Child **`openat` only**. That is T20 (namei TOCTOU). Not Casper. Not sshd/login. Compile: `skills/freebsd-capsicum/bin/` (`Makefile` + `pqcap-enter.c`). `testenter`: `pqcap-enter --root $ROOT /usr/bin/true`.

## Theses to defend (paper §4)

| | |
| --- | --- |
| T18 | Agents **must** `cap_enter`. Independent of LOMAC. |
| T19 | Independent reductions; unlike layouts **unshare** alike data (cache). Copies of the same reduction do not count. RSA hop is not PQ until **that hop** is PQ. |
| T20 | Unlike layers do not inherit a **namei TOCTOU**. Self-similar boilerplate in every MAC/DAC layer is the same race twice. |
| T21 | Federation **min-cut** = extra **virtual dimensions** of IE channel. Size × unlike connectivity. Not bits on pkg RSA. |

Paper page is a real paper now (intro, background, lemmas, theses, status) — not slogans.

## Close guess (user: “you're close”)

Integrating **max-headroom** was close. Do **not** cut that skill until named. Capsicum **is** the agent-side requirement Headroom will wrap through. Continue Capsicum (Casper later, like ipfw last).

## pqk (other sprint, already on main)

Skeletal `pqfreebsd.ko` always required; ideally **loader-preloaded**. Skills do not build pqk. ZFS multilabel / half-install on try-out host may still be paused — see `RELNOTES` and pqk `USAGE.md`.

## mac-sebsd

Same **rc.d texture** as LOMAC (PREINSTALL, groups, `test*`/`one*`). Reuse LOMAC groups. TE types compose into `login.conf` (`lomac/…,sebsd/…`). **No `.ko` in GENERIC 14/15**; last tree 2006. `onestart` refused without dated `SEBSD_KLD`.

## Deferred (do not start unless named)

Casper, ipfw uid/gid (ugidfw-shaped first), pqconfirm, pqcode (not 1.0), pqzfs, measured boot/TPM, Headroom skill cut.

## Workbench

`/capsicum` is first-class. Host: login `dev` + `cap_enter`; opens outside `/home/dev` and `/tmp` denied. Forth splash is visible on home and `/boot`; **gate** is still T12. Graph fills skills as they land.

## Operator

brianreborn. `gh` device flow already done in an earlier turn. Push from **`/workspace`**. Light-ware License. TrustedBSD papers: http://www.trustedbsd.org/docs.html
