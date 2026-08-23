# Base GENERIC MAC modules

These `.ko` ship in a **base FreeBSD kernel** built with `options MAC`
(`GENERIC` does). They load with `kldload(8)` / `loader.conf(5)`. This skill
is that set — not a grab-bag, not SEBSD, not ipfw.

| Module | Labels? | In GENERIC | Notes |
| --- | --- | --- | --- |
| **mac_seeotheruids(4)** | no | yes | Hide other UIDs. Default here. Exempt one GID (usually `wheel`=0). |
| **mac_ifoff(4)** | no | yes | Silence non-loopback. Can cut SSH. Opt-in only. |
| **mac_portacl(4)** | no | yes | uid/gid **bind** to listed ports. Also needs `net.inet.ip.portrange.reservedlow=0`. Not a packet filter. |
| **mac_bsdextended(4)** | no | yes | **ugidfw(8)** filesystem firewall. Empty ruleset = allow all. |
| **mac_partition(4)** | yes | yes | Process partitions. Prefer seeotheruids. |
| **mac_ipacl(4)** | no | yes | IP address ACL. |
| **mac_do(4)** | no | yes | Constrain credential changes. |
| **mac_priority(4)** | no | yes | Priority / nice. |
| **mac_lomac(4)** | yes | yes | Integrity lattice. **Not this skill** — **freebsd-mac-lomac**. |
| **mac_biba(4)** / **mac_mls(4)** | yes | yes | Second information-flow policy. Do not stack with LOMAC unless they insist. |
| **mac_ntpd(4)** | — | yes | ntpd exception. Leave to ntpd. |

**Not base (not in GENERIC, not this skill):**

| | |
| --- | --- |
| **SEBSD** / `mac_sebsd` | FLASK/TE. Last tree FreeBSD **7.0-SEBSD**, 2006-07-05. See **mac-sebsd**. Do not kldload a guessed `.ko`. |
| **ipfw** `uid`/`gid` | Packet filter. Saved last; first pass would be ugidfw-shaped. Not MAC. |

Old name: **freebsd-mac-generic**. This skill is the same modules, named for what the **base** kernel actually ships.

Source: parent catalog in freebsd-mac-grok; Handbook [MAC](https://docs.freebsd.org/en/books/handbook/mac/); [TrustedBSD MAC](http://www.trustedbsd.org/mac.html).
