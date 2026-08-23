# mac-sebsd

FLASK / Type Enforcement on the TrustedBSD MAC Framework.
**Same rc.d texture as freebsd-mac-lomac.** Different axiom.

There is **no** `sebsd.ko` in GENERIC 14/15. Last tree: 7.0-SEBSD,
2006-07-05. [sebsd.html](http://www.trustedbsd.org/sebsd.html).
Paper: [sebsd-july2003.pdf](http://www.trustedbsd.org/sebsd-july2003.pdf).

Roles are the **same pw(8) groups** as LOMAC when that package is present.
TE types attach to those groups. Do not create `sebsd-trusted` next to
`lomac-trusted` unless the operator insists.

```
/usr/local/etc/rc.d/mac_sebsd_grok
/usr/local/etc/mac_sebsd_grok/POLICY
/usr/local/etc/mac_sebsd_grok/sebsd-policy.contexts
/var/db/mac_sebsd_grok/PREINSTALL/
```

```sh
sudo ~/mac-sebsd/mac_sebsd_grok oneinstall
sudo service mac_sebsd_grok onestage          # PREINSTALL + login classes; no kld
sudo service mac_sebsd_grok teststart         # fails on stock GENERIC — expected
# onestart / onelabel / oneenforce refuse until SEBSD_KLD is a dated, kernel-matched file
sudo service mac_sebsd_grok oneuninstall
```

`extra_commands` match **mac_lomac_grok(8)**: install, snapshot, stage, update,
label, checklabels, enforce, unenforce, uninstall, `test*`.

| Role (from LOMAC) | Default TE type |
| --- | --- |
| exempt / root | `sebsd/sysadm_t` |
| trusted group | `sebsd/staff_t` |
| sandbox group | `sebsd/user_t` |

Types are not grades. A sandbox type is not “low-integrity.”

## Known issues

| Issue | Happens | This package |
| --- | --- | --- |
| No `.ko` in GENERIC | `kldload sebsd` fails | `onestart` refused; stage still writes POLICY |
| 2006 object on 15.1 | ABI rot | Require `SEBSD_KLD` + `SEBSD_DATE` + `SEBSD_BUILT_FOR` |
| Second group pair | Operator thinks TE is another lattice | Reuse LOMAC groups |
| `label=` overwrite | Wiping `lomac/high` | Compose slots: `lomac/…,sebsd/…` |
| Empty file_contexts | Like empty ugidfw | `sebsd-policy.contexts` is a stub until a module loads |
| Unsigned `.ko` | T11 | Even a matching kld is code-auth; pqcode held |

Snapshots: skip when the umbrella already took them.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
