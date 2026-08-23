# pqfreebsd

**pq all the things**

**PQFreeBSD** is the official, non-fancy project name.  
**Free(ly)B(le)S(se)D** — *Freely Blessed* — is the evocative form (Unix-style
expansion that still reads FreeBSD).

**Derived from [freebsd-mac-grok](https://github.com/brianreborn/freebsd-mac-grok).**
**Copyright © 2026 Brian Fundakowski Feldman.**
**License: [Light-ware](LICENSE).** See **[NOTICE.md](NOTICE.md)**.  
**Release notes:** see **[RELNOTES](RELNOTES)** (FreeBSD-style; half-install
continuity; master placement vs pqk).  

**Sprint expenses:** see **[USAGE.md](USAGE.md)**.

Grok **plugin** plus a workbench for a **post-quantum trusted FreeBSD**:
quantum-adversary-stable mediation (**pqac(7)**), Integrity Evidence, repaired
A_D, successive policy audit, a loader gated on attestation. Not Kyber in the kernel.
The access-control kernel is the **[TrustedBSD MAC Framework](http://www.trustedbsd.org/mac.html)**;
papers not in base: [docs](http://www.trustedbsd.org/docs.html).

| Layer | What |
| --- | --- |
| Parent | **mac_lomac(4)** integrity, orthogonal modules, **zfs snapshot -r**, PREINSTALL. No **bectl(8)**. |
| **Kernel KLDs** | **[pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel)** (**pqk**, not LLM-dependent) — skeletal `pqfreebsd.ko` always required (will be critical: lockdown without modifying FreeBSD source); siblings as needed to enable. Not built by **pqf skills**; **ideally loader-preloaded**, later with **full TPM e2e** (not this cut). |
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

**Kernel modules (pqk)** are **not** a submodule, **not** LLM-dependent, and
are **not** built on demand by **pqf skills**.
[pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel) is a
separate deliverable: only skeletal `pqfreebsd.ko` is always required;
siblings load as needed to enable. **Ideally loader-preloaded** every boot
(and later with **full TPM e2e** on that path — not this cut);
install/stage/start only ensure `loader.conf.local` and fall back to
`kldload` until reboot.

```sh
git clone --recurse-submodules https://github.com/brianreborn/pqfreebsd.git
# first push (repo may need creating):
#   gh repo create brianreborn/pqfreebsd --public --source=. --remote=origin --push
```

## Checkpoints

After every milestone — a main module or a freebsd-mac skill at top-level —
commit and push:

```sh
sh scripts/checkpoint.sh "milestone: pqaudit — consistency, propagate, successive revs"
```

Needs `origin` and GitHub credentials (`GH_TOKEN` / `gh auth`). Until those
exist, checkpoints stay local.

## Port

`ports/sysutils/pqfreebsd` is a small in-tree FreeBSD port. It stages the suite
and requires a **skill-capable LLM** to operate it. The port cannot prove a
model is advanced; `pqfreebsd-llm-check` finds a candidate, then you attest
(`pqfreebsd_llm_attested=YES`). On a via-port install, `oneenforce` is refused
until that conjunct. Copy the directory to `/usr/ports/sysutils/pqfreebsd`.

Paper: `mandoc -T pdf skills/pqfreebsd/man/man7/pqac.7`
and `skills/pqfreebsd/man/man7/pqfreebsd.7`.

## Host order

```sh
sudo ./pqfreebsd oneinstall
sudo service pqfreebsd onesnapshot
sudo service pqfreebsd onestage
sudo service pqfreebsd onesnapshot_after
sudo service pqfreebsd start      # every boot; KLDs + children (also on install/stage)
sudo service pqledger onestage
sudo service pqdac oneestablish
# parent labels:
sudo service mac_lomac_grok onelabel && onechecklabels
# only in a test window, console:
sudo service pqfreebsd oneenforce
```

`oneuninstall` restores PREINSTALL *behavior*. Snaps kept. uninstall ≠ wipe ≠ rewind.

Unsigned, as the parent. Pin a commit.
