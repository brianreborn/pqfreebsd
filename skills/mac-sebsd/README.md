# mac-sebsd

FLASK / Type Enforcement on the TrustedBSD MAC Framework.
**There is no sebsd.ko in a base GENERIC 14/15 kernel.**

Last published tree: FreeBSD **7.0-SEBSD**, **2006-07-05**.
Project page: [trustedbsd.org/sebsd.html](http://www.trustedbsd.org/sebsd.html)
Paper: [sebsd-july2003.pdf](http://www.trustedbsd.org/sebsd-july2003.pdf)
Tree: [github.com/TrustedBSD/sebsd](https://github.com/TrustedBSD/sebsd)

This skill catalogs that fact and **refuses to kldload** unless you name a
module built for *this* kernel, with a date. A 2006 object is not “recently
known to work.”

```sh
sudo ~/mac-sebsd/mac_sebsd_grok oneinstall
sudo service mac_sebsd_grok onestage     # POLICY + catalog only
sudo service mac_sebsd_grok testkld      # must fail on stock GENERIC
# onestart / oneenforce refused while SEBSD_KLD is empty
```

Forward-port (TrustedBSD): MAC Framework side is the easy part; FLASK/TE and
a reference policy are not. Until that exists, TE is a held conjunct. It does
not un-prove high-integrity overwrite protection (T14).

Not an RBAC wrapper around LOMAC.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
