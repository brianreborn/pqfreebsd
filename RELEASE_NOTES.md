# Release notes — pqfreebsd

**PQFreeBSD** — official non-fancy name. **Free(ly)B(le)S(se)D** (*Freely
Blessed*) — evocative FreeBSD expansion (Unix-traditional wordplay).

## Current cut

### Test host status (acknowledgement)

The development / try-out host is **only half-installed** with this skill.
Work stopped on a **ZFS host bug**: mounts do not advertise `MNT_MULTILABEL`
(UFS/FFS does). That blocks MAC labels as EAs on ZFS and stalled the install
past early `one*` steps.

**Remediation lives in** [pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel)
(`pqfreebsd.ko` + ZFS-only `pqfreebsd_compat_zfs_multilabel.ko`). A proper fix
**will go upstream**; the compat KLD is temporary accommodation.

**After the blocker is cleared on that machine, continue the half-finished
install** — do not treat the box as a clean slate unless snapshots /
`PREINSTALL` require it. Resume from the suite order (roughly: ensure
KLDs loaded via start/boot/install → `pqledger` / `pqdac` → parent `onelabel` /
`onechecklabels` → optional `oneenforce` in a test window). See
`skills/pqfreebsd/SKILL.md` § Order and § pqfreebsd_kernel.

### Where a master project should put these pieces

When an umbrella / master project **imbibes** PQFreeBSD and its kernel tree:

| Piece | Put it here | Why |
| --- | --- | --- |
| `pqfreebsd` (**pqf skills**, this repo) | Skill suite + userland (`skills/`, port under `ports/sysutils/pqfreebsd`, result dirs). | Operator-facing install and `one*` flow; uses installed `.ko`, does not compile them. |
| `pqfreebsd_kernel` (**pqk**) | **Separate kernel deliverable** next to (not inside) **pqf skills**. Not LLM-dependent. Build/install as normal KLDs. | Requisite/generic; not built on demand by pqf skills; core is the no-src-mod lockdown foothold. |

Do **not** merge the KLD sources into the pqf skills package. **pqf skills**
**use** installed `.ko` files; the kernel repo (**pqk**) **ships** them.

**Required vs optional KLDs** (master must not invert this):

- Always required: `pqfreebsd.ko` only.
- ZFS enablement only: `pqfreebsd_compat_zfs_multilabel.ko`.
- Later siblings: as needed to enable; never required merely to load the skeleton.
