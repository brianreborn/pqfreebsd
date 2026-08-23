# pqfreebsd

Post-quantum **trusted FreeBSD**: compose **freebsd-mac-grok** and layer
Integrity Evidence, repaired **DAC**, successive policy audit, and a
loader gated on attestation. Mediation (**pqac(7)**) is the core, not the whole system.
Read **pqac(7)** then **pqfreebsd(7)**.

The MAC this skill composes is the **[TrustedBSD](http://www.trustedbsd.org/) MAC Framework**.
Papers **not in the base install**: [docs.html](http://www.trustedbsd.org/docs.html)
([USENIX 2003](http://www.trustedbsd.org/trustedbsd-usenix2003freenix.pdf),
[DISCEX III](http://www.trustedbsd.org/trustedbsd-discex3.pdf),
[SEBSD](http://www.trustedbsd.org/sebsd-july2003.pdf),
[TR-818](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-818.pdf)).

This is the **skill**. When it runs it writes a **result directory** that
installs as ports-style **rc.subr(8)** services: `pqfreebsd`, `pqledger`,
`pqdac`. Parent packages (`mac_grok`, `mac_lomac_grok`, `mac_generic_grok`)
remain authoritative for A_M.

Not PQC in the kernel. Not Faraday. Not root containment.

**Held:** payload confirmation (T10 / `pqconfirm`) is required of the system
and is **not** implemented here.

## pqfreebsd_kernel (skeleton required; siblings as needed)

[pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel): only
**`pqfreebsd.ko` is always required**. Any number of sibling `pqfreebsd_*`
KLDs may be needed **to enable** a given path; the suite loads them when
installed. Operators are not asked to hand-`kldload`. This skill does not
build that tree on demand.

**ZFS multilabel** (optional until labels-on-ZFS are needed): OpenZFS does not
set `MNT_MULTILABEL` like UFS. Proper fix upstream;
`pqfreebsd_compat_zfs_multilabel` papers over it. Do not flip dataset `xattr=`
to “fix” LOMAC.

## Invoke

`/pqfreebsd` — “post-quantum access control”, “audit ledger”, “repair DAC”,
“pqac”.

## Order

```sh
sudo ~/pqfreebsd/pqfreebsd oneinstall
sudo service pqfreebsd onesnapshot          # BEFORE — zfs snapshot -r (fs + zvol)
sudo service pqfreebsd onestage
sudo service pqfreebsd onesnapshot_after
sudo service pqfreebsd onestart             # kldload; quiet ZFS multilabel compat; enabled=0
sudo service pqledger onestage
sudo service pqdac oneestablish
sudo service pqdac testdrift
# parent:
sudo service mac_lomac_grok onelabel && onechecklabels
sudo service pqfreebsd oneenforce           # only in a test window
```

| Command | Effect |
| --- | --- |
| `snapshot` | `pqfreebsd-pre-<utc>` **zfs snapshot -r**; checkpoint only if opted in |
| `snapshot_after` | `pqfreebsd-post-<utc>` |
| `stage` | PREINSTALL; parent children skip ZFS; create ledger dataset; install specfiles |
| `establish` | pqdac: apply first-match spec to existing tree |
| `repair` | restore drifted owner/group/mode; ledger event |
| `verify` | pqledger: walk the hash chain |
| `uninstall` | PREINSTALL behavior; snaps and ledger dataset kept |
| `test*` | Dry-run. Diffs/`WOULD` only. |

Rollback: `zfs rollback -r <pool>@pqfreebsd-pre-…`. Names: `/var/db/pqfreebsd/zfs.snaps`.
**No bectl(8)**.

## pqledger

Append-only dataset (default `zroot/pq/ledger`), labeled **high-integrity**
(`lomac/high` in the kernel).
Records: vnode ops, label morphisms, establish/repair, enforce. Hash chain
(SHA-512 on the host). **audit(4)** is the in-band source; `/var/audit` is
**not** the chain. Rotation appends a checkpoint record. Rewrite is a bug.

## pqdac

Restricted language: path-regex → owner, group, dir_mode, file_mode.
First-match, same combinator as **setfsmac(8)**. Modes:

| Mode | Syscall | After |
| --- | --- | --- |
| `observe` | chmod/chown succeed | testdrift reports |
| `repair` | succeed | morphism restores; ledger `repair` |
| `prevent` | **ugidfw(8)** denies grants that would drift | still repair existing; empty ruleset is allow-all until generated |

This does not make A_D into A_M. Conjunction is not a product of proofs.

## Known issues (official docs and mailing lists)

Keep this section in the result README. Walk it before `oneenforce`. Parent
catalogs still apply — read **freebsd-mac-lomac** and **freebsd-mac-generic**
Known issues; do not duplicate every row here.

### Inherited (parent)

| Issue | Source | What this package does |
| --- | --- | --- |
| Enforce before labels | pqac(7); Handbook §19.8 | enabled=0 until setfmac probe |
| setfsmac first-match | setfsmac(8) | overlays (incl. ledger high) before PLM |
| Remote MAC | Handbook §19.4 | snapshots first; console |
| mac(9) incomplete root | mac(9) BUGS | root equal, not contained |
| Checkpoint rewind | zpool-checkpoint(8); OpenZFS 12646 | default snapshot -r; no bectl |
| ifoff drops the wire | mac_ifoff(4) | seeotheruids-only default |
| ugidfw empty = allow-all | mac_bsdextended(4) | do not claim prevent is on until testdrift clean |
| Aux/extattr | PR 178667 | ledger is a high dataset, not aux |
| ZFS not UFS multilabel | freebsd-security; pqac(7) | Trivial bug; proper fix upstream. Suite loads [pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel) compat from `onestart` when `.ko` installed — no operator ritual; probe /tmp; do not flip `xattr=` |
| uninstall ≠ wipe | mac_grok(8) | PREINSTALL then optional rollback |

### This skill

| Issue | Source | What happens | What this package does |
| --- | --- | --- | --- |
| BSM is not tamper-evident | audit(4) | root can truncate `/var/audit` | chain on high dataset is the evidence |
| Ledger unlabeled at enforce | pqac empty interpretation | overwrite undefined | overlay labels the dataset high-integrity first |
| Repair is not prevention | pqfreebsd(7) T6 | concurrent reader may see drifted mode | say so; prevent is ugidfw, different proof |
| Unrestricted A_D is HRU | CACM 19(8) 1976 | safety undecidable | restricted spec only; no grant verbs |
| Ledger daemon is a subject | pqac T4 | O may factor through it | high label; not Faraday |
| Event integrity ≠ payload integrity | pqfreebsd(7) T10 | later subject cannot confirm the bits | **required; not this pass.** pqconfirm. Do not pretend scrub is that API |

## See also

**pqac(7)**, **pqfreebsd(7)**, **pqfreebsd(8)**, **pqledger(8)**, **pqdac(8)**,
**mac_grok(8)**, **mac_lomac_grok(8)**, **mac_lomac(4)**, **audit(4)**,
**ugidfw(8)**, **setfsmac(8)**, **zfs(8)**, FreeBSD Handbook ch.19.

---
Copyright © 2026 Brian Fundakowski Feldman. Light-ware License.
This product includes software developed by Brian Fundakowski Feldman.
