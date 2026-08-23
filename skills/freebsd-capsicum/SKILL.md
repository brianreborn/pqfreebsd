---
name: freebsd-capsicum
description: >
  Capsicum capability mode for FreeBSD (cap_enter, GENERIC). Confinement of
  the ambient namespace after needed fds are open. Not MAC, not a jail, not
  ipfw. Use when the user wants /freebsd-capsicum, cap_enter, Casper, or to
  sandbox low-integrity agents (max-headroom). Critical: do not skip.
---

# freebsd-capsicum

Read `README.md` and `references/catalog.md` first.

Capsicum is a **TrustedBSD** capability system, in **GENERIC**
(`options CAPABILITY_MODE`, `options CAPABILITIES`). Paper (not in the base
install): Watson, Anderson, Laurie, Kennaway,
[Capsicum: practical capabilities for UNIX](http://www.trustedbsd.org/2010usenix-security-capsicum-website.pdf),
USENIX Security 2010. Also UCAM-CL-TR-818.

It is **not** `mac(4)`. A process in capability mode still has a LOMAC label.
Low-integrity agents (**max-headroom**) **must** `cap_enter`. That is this
skill. Missing Capsicum does not un-prove high-integrity overwrite protection
(T14). Running agents *without* it is a missing conjunct of confinement.

`${SKILL_DIR}` = this skill directory.

## Output

Result `~/freebsd-capsicum/`:

1. Copy `README.md` (**keep** Known issues), `references/catalog.md`, `man/`.
2. Copy `bin/pqcap-enter.c` and `scripts/capsicum_grok` (0755).
3. Write `POLICY`: `AGENTS_MUST=YES` (default), `CASPER=NO` (first pass),
   `WRAP=` space-separated binaries (default: the agent wrapper if Headroom
   is in play).

`onestage` compiles `pqcap-enter` on FreeBSD (`cc`, `caph_enter`).
`testenter` runs `pqcap-enter /usr/bin/true`. `oneenforce` is not a kldload
— Capsicum is already in the kernel. It means listed agent commands are
invoked *through* `pqcap-enter`.

## Interview

1. Confirm they know this is **capability mode**, not MAC grades, not a jail.
2. Low-integrity / agent subjects: **must** enter capability mode? Default **yes**.
3. First pass: `caph_limit_stdio` + `caph_enter` + `exec`. **Casper**
   (libcasper services) is a later pass, like ipfw after ugidfw-shaped rules.
4. You cannot `cap_enter` an entire GUI login. Do not wrap `sshd` or `login`.
5. Base programs that already enter (ping, some dhclient, tcpdump, …) stay as
   they are. This skill wraps **ours** (agents).
6. Orthogonal to LOMAC: wrap *and* label. Do not skip the lattice because
   Capsicum exists.

## Apply

`oneinstall` → `onestage` (compile helper, PREINSTALL empty — no loader
block) → `testenter` → install wrapper path. Never `kldload`. `test*` first.

If **pqfreebsd** composes this, Headroom agents go through `pqcap-enter`.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
