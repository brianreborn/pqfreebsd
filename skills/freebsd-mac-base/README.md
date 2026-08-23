# freebsd-mac-base

MAC modules a **base GENERIC** kernel already contains (`options MAC`).
Not LOMAC, not SEBSD, not ipfw.

`/freebsd-mac-base` or “enable seeotheruids”, “portacl”, “ugidfw”, “what’s in GENERIC”.

Old name: **freebsd-mac-generic**. Same modules; this name is the claim.

```
/usr/local/etc/rc.d/mac_base_grok
/usr/local/etc/mac_base_grok/POLICIES
/usr/local/etc/mac_base_grok/POLICY
/var/db/mac_base_grok/PREINSTALL/
```

```sh
sudo ~/freebsd-mac-base/mac_base_grok oneinstall
sudo service mac_base_grok onestage
sudo service mac_base_grok onestart
sudo service mac_base_grok oneuninstall
```

`POLICIES`: `seeotheruids`, `ifoff`, `portacl`, `bsdextended`, `partition`, `ipacl`, `do`, `priority`.

- Default: **mac_seeotheruids(4)** only, exempt GID 0.
- **mac_portacl(4)** is bind-by-uid, not ipfw. Needs `net.inet.ip.portrange.reservedlow=0`.
- **mac_bsdextended(4)** empty = allow all.
- **mac_ifoff(4)** can drop SSH.

## Known issues

Keep this section. Inherited from freebsd-mac-generic README (Handbook ch.19, PRs) plus:

| Issue | Happens | This package |
| --- | --- | --- |
| Calling this “generic” | Sounds like a dump of every policy | Named **base**: GENERIC `.ko` only |
| portacl ≠ ipfw | Bind vs packets | portacl optional; ipfw is a later skill, ugidfw-shaped first |
| SEBSD is not GENERIC | No `mac_sebsd.ko` in 14/15 | **mac-sebsd** refuses kldload unless a kernel-matched module is named |
| Two rc.d (generic + base) | Double loader blocks | Install one. pqfreebsd composes **base** |

Handbook: [MAC](https://docs.freebsd.org/en/books/handbook/mac/). TrustedBSD: [mac.html](http://www.trustedbsd.org/mac.html), [docs](http://www.trustedbsd.org/docs.html).

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
