# Usage / expenses

PQFreeBSD (**pqf**) / **pqk** agent spend tracking. Each sprint appends a
section. Figures are derived from Grok session telemetry (`costUsdTicks`,
nanodollar scale `USD = ticks / 1e9`) unless noted. Confirm with **`/usage`**.

---

## 2026-08-23 — pqk ZFS multilabel / core state sprint

| Field | Value |
| --- | --- |
| Session | `01a02deb-19e7-7661-b61a-5ded24dbf6d3` |
| Focus | [pqfreebsd_kernel](https://github.com/brianreborn/pqfreebsd_kernel) + pqf load/docs |
| Duration | ~35 min wall |
| Models | `grok-4.5-build`, `grok-4.6-build` |
| Total tokens (summed turn snapshots) | ~29.5M (mostly cache reads) |
| Model calls | 149 |
| **Est. cost** | **~$59.05 USD** (`costUsdTicks` 59049127920 @ 1e-9) |
| Detail | See [`pqfreebsd_kernel/USAGE.md`](https://github.com/brianreborn/pqfreebsd_kernel/blob/main/USAGE.md) |

Half-install on the try-out host remains paused on the ZFS multilabel blocker;
continue after pqk compat is installed (see `RELNOTES`).
