# Swarm conductor — requirements (not the product)

Source (reuse, no linguistics): [japanglify `docs/swarm-conductor/`](https://github.com/brianreborn/japanglify/tree/main/docs/swarm-conductor).

Copy that directory and the generic Actions (`conductor-config.yml`, `swarm-watchdog.yml`). **Do not** copy `docs/japanglify/` or `GLOSSARY.md`. Instance `/uat` (adb, APK) is Japanglify-only.

A lesser model may wire GitHub automations from this matrix. It may not invent a second event bus, stack runners, or let the conductor `cap_enter` on behalf of a worker.

## Philosophy (T22)

Japanglify: *a role is only a starting set of capabilities. The conductor dispatches; it does not implement, build, or sign.*

That is already this suite’s language.

| Japanglify | PQFreeBSD |
| --- | --- |
| Role = starting capabilities | Capsicum rights + label + `A_D` (not ambient UNIX) |
| Conductor does not implement | Port is not the operator; pqk is not LLM-built |
| GitHub is the mailbox | Event bus is not the TCB; IE is a different layout |
| `ledger.append` in every `may` | Integrity Evidence is a conjunct of **every** role |
| Do not stack runners | Unlike layers; do not duplicate `namei` (T20) |
| Watchdog cancels, does not propose | Separate predicate from the bench |
| Fleet `effort:*` cap | Budget is not a security claim (T14) |
| `/accept` does not spawn a worker | Dispatch ≠ enter |

Workers (bench, synthesizer, reproducer) are the low-integrity agents: `pqcap-enter --root $WORK`, `PQCAP_ROOTFD=3`. The conductor posts as a trusted *actor* on GitHub and **must not** compile, `kldload`, merge `main`, or hold keystore.

## Roles (starting sets)

See [`swarm-roles.json`](swarm-roles.json). Overlay of japanglify `roles.json`.

| Role | May | Must not | Integrity | `cap_enter` |
| --- | --- | --- | --- | --- |
| swarm-conductor | ingest, propose assignment, comment, `ledger.append` | push, open pull request, domain test, `secret.*`, `device.*` | high (dispatcher) | no (needs mailbox); not a substitute for worker enter |
| watchdog | cancel, status, cancel-run, alert human, `ledger.append` | propose assignment, push, open pull request | high | no |
| swarm-bench | push agent branch, open pull request, domain test, `ledger.append` | propose assignment, release keystore, remote assemble | **low** | **yes** `--root` workspace |
| reproducer | push, test, hypothesis, `ledger.append` | conductor duties | low | yes |
| analyzer | `ledger.append`, hypothesis ± | push | low | yes (stdio + ledger fd) |
| synthesizer | push, pull request, test, patch, `ledger.append` | conductor duties | low | yes |
| verifier | comment, review.record, `ledger.append` | push | low or trusted-read | yes if it executes |

`may` is DAC-shaped (starting set). `must_not` is MAC-shaped (cannot elect away). Both are mandatory at the hook.

## Event bus

GitHub issues and pull requests are the mailbox. The bench does not poll the conductor. The conductor does not poll the bench. Do not busy-wait in a Grok chat (japanglify `events.md`).

That is an unlike channel (T21): GitHub is one transport of work orders. It is not Integrity Evidence, not `zfs send`, not a PQ signature. Stranding GitHub degrades **dispatch**, not high-integrity overwrite protection.

Loop guard (japanglify `loops.md`): a comment must not be a command for the thing that just wrote it. Bots never `/uat` or `/kick`. `/accept` does not spawn a worker.

## Budget (not a bound)

`effort:low|medium|high|xhigh`. Effective = min(issue, fleet cap, per-role, host band). Cap changes apply at next process start. Relabeling to dodge a cap is not a dimension. USAGE.md remains the spend log.

## Must / must-not (suite)

| | |
| --- | --- |
| Must | Workers `pqcap-enter --root`; every role `ledger.append`; GitHub mailbox; copy generic conductor docs only |
| Must | Kickoffs state Grok CLI effort |
| Must not | Conductor Gradle, adb, keystore, merge `main`, `kldload` |
| Must not | Stack conductor + bench in one process |
| Must not | Treat GitHub as TCB or as PQ |
| Must not | Copy Japanglify linguistics / Android `/uat` into this tree |
| Must not | Headroom skill until named; conductor is the dispatch overlay, not that runtime |

## Status

Requirements only. No Actions in this repo yet. Japanglify remains the reference instance.
