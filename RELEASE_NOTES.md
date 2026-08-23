# Release notes — pqfreebsd

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
`onestart` has loaded the KLDs → `pqledger` / `pqdac` → parent `onelabel` /
`onechecklabels` → optional `oneenforce` in a test window). See
`skills/pqfreebsd/SKILL.md` § Order and § pqfreebsd_kernel.

### Where a master project should put these pieces

When an umbrella / master project **imbibes** PQFreeBSD and its kernel tree:

| Piece | Put it here | Why |
| --- | --- | --- |
| `pqfreebsd` (this repo) | Skill / plugin + userland (`skills/`, port under `ports/sysutils/pqfreebsd`, result dirs). | Operator-facing install and `one*` flow. |
| `pqfreebsd_kernel` | **Separate kernel deliverable** next to (not inside) the skill tree. Build/install as normal KLDs. | Requisite/generic; not built on demand by create-skill; core is the no-src-mod lockdown foothold. |

Do **not** merge the KLD sources into the skill package. The skill **uses**
installed `.ko` files; the kernel repo **ships** them.

**Required vs optional KLDs** (master must not invert this):

- Always required: `pqfreebsd.ko` only.
- ZFS enablement only: `pqfreebsd_compat_zfs_multilabel.ko`.
- Later siblings: as needed to enable; never required merely to load the skeleton.
