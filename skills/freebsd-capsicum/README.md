# freebsd-capsicum

**Capability mode** (`cap_enter(2)`), in GENERIC. Not MAC. Not a jail.

Critical for this suite: low-integrity **agents** must drop the ambient
namespace after they have the fds they need. LOMAC stops a low-integrity
process overwriting high-integrity files. Capsicum stops it opening *new*
paths, sockets, and sysctls it did not keep.

Paper (not in `man`): Watson, Anderson, Laurie, Kennaway,
[Capsicum: practical capabilities for UNIX](http://www.trustedbsd.org/2010usenix-security-capsicum-website.pdf),
USENIX Security 2010. Project notes: [trustedbsd.org](http://www.trustedbsd.org/).
Handbook is thin; the paper is the document.

```sh
sudo ~/freebsd-capsicum/capsicum_grok oneinstall
sudo service capsicum_grok onestage      # compile pqcap-enter
sudo service capsicum_grok testenter
pqcap-enter /usr/bin/true
# agents:
pqcap-enter /usr/local/libexec/headroom-agent …
```

First pass is **ugidfw-shaped**: enter + limited stdio, not a Casper product.
`CASPER=NO` until that pass.

## Known issues

| Issue | Happens | This package |
| --- | --- | --- |
| Wrapping login/sshd | Session cannot open ptys, DNS, … | Refuse. Agents and named WRAP only. |
| cap_enter after a bug | Process already has the world | Open fds *then* enter. Helper does stdio only. Casper later. |
| “Capsicum replaces MAC” | Operator unloads LOMAC | Orthogonal. Both. T14. |
| Linux / this workbench | No `sys/capsicum.h` | Helper refuses to compile except on FreeBSD. Skill still ships. |
| Base daemons already sandboxed | Double enter is EPERM | Do not wrap ping/tcpdump. |
| No kld | Capsicum is GENERIC | onestart is not kldload. |

`man cap_enter`, `man capsicum`, `man libcasper`, `man caph_enter`.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
