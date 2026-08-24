# Capsicum (GENERIC) — not MAC

In a base kernel:

- `options CAPABILITY_MODE`
- `options CAPABILITIES`

No `.ko`. `kldload` is a category error.

| Piece | First pass | Later |
| --- | --- | --- |
| `cap_enter(2)` / `caph_enter(3)` | **yes** — `pqcap-enter` | — |
| `caph_limit_stdio` | **yes** | finer fd rights |
| `--root` / `PQCAP_ROOTFD=3` | **yes** — agent workspace fd; `openat` only | — |
| `cap_rights_limit(2)` on that dir | **yes** (lookup/read/write/create/fchdir) | extra rights |
| libcasper | no | Casper pass |
| CloudABI / Wasmer | no | not this suite |

**Subjects:** low-integrity agents (max-headroom). Not `root` login, not `sshd`.

**Orthogonal:**

| | |
| --- | --- |
| LOMAC | integrity lattice (write-up) |
| freebsd-mac-base | GENERIC MAC `.ko` |
| jail(8) | another namespace; can nest |
| ipfw uid | packets; saved last |

Papers: [2010 USENIX Security](http://www.trustedbsd.org/2010usenix-security-capsicum-website.pdf);
[UCAM-CL-TR-818](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-818.pdf) (MAC *and* Capsicum).
