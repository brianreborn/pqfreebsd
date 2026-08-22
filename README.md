# pqfreebsd

**Derived from [freebsd-mac-grok](https://github.com/brianreborn/freebsd-mac-grok).**
**Copyright © 2026 Brian Fundakowski Feldman.**
**License: [Light-ware](LICENSE).** See **[NOTICE.md](NOTICE.md)**.

Grok **plugin** plus a workbench for **post-quantum access control** on FreeBSD:
not Kyber in the kernel, but quantum-adversary-stable mediation (**pqac(7)**)
with two morphisms the parent suite omitted.

| Layer | What |
| --- | --- |
| Parent | **mac_lomac(4)** integrity, orthogonal modules, **zfs snapshot -r**, PREINSTALL. No **bectl(8)**. |
| **pqledger** | Filesystem Integrity Evidence: hash-chained vnode/policy log on a **high** dataset. |
| **pqdac** | Restricted A_D spec, established at create, repaired on drift. Optional ugidfw prevent. |

Installing the Grok plugin only loads skills. Host scripts change a FreeBSD box
only when you (or the agent, with sudo) run `oneinstall` / `onestage` /
`oneenforce`. No install-time hooks, MCP servers, or `curl | bash`.

Requires the parent plugin:

```sh
grok plugin install brianreborn/freebsd-mac-grok --trust
```

## Skills

| Path | Slash | Role |
| --- | --- | --- |
| `skills/pqfreebsd/` | `/pqfreebsd` | Interview, snapshots, compose parent, emit ledger + DAC packages |

Parent **freebsd-mac-grok** is a **top-level git submodule** (`vendor/freebsd-mac-grok`).
Each later FreeBSD MAC skill (pqzfs, pqcode, mac-sebsd, …) gets its own repo and
is added the same way, after you say so.

## Checkpoints

After every milestone — a main module or a freebsd-mac skill at top-level —
commit and push:

```sh
sh scripts/checkpoint.sh "milestone: pqaudit — consistency, propagate, successive revs"
```

Needs `origin` and GitHub credentials (`GH_TOKEN` / `gh auth`). Until those
exist, checkpoints stay local.

Paper: `mandoc -T pdf skills/pqfreebsd/man/man7/pqac.7`
and `skills/pqfreebsd/man/man7/pqfreebsd.7`.

## Host order

```sh
sudo ./pqfreebsd oneinstall
sudo service pqfreebsd onesnapshot
sudo service pqfreebsd onestage
sudo service pqfreebsd onesnapshot_after
sudo service pqledger onestage
sudo service pqdac oneestablish
# parent labels:
sudo service mac_lomac_grok onelabel && onechecklabels
# only in a test window, console:
sudo service pqfreebsd oneenforce
```

`oneuninstall` restores PREINSTALL *behavior*. Snaps kept. uninstall ≠ wipe ≠ rewind.

Unsigned, as the parent. Pin a commit.
