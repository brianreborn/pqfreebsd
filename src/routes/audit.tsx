import { createFileRoute } from "@tanstack/react-router";
import { audit, shortHash } from "@/lib/pq/audit";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({ component: Audit });

function Audit() {
  const world = usePq((s) => s.world);
  const dispatch = usePq((s) => s.dispatch);
  const report = audit(world);
  const changed = report.deltas.filter((d) => d.status !== "same");

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T13 · successive policy · oneaudit</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          {report.ok ? "Audit successful." : "The policies do not yet agree."}
        </h1>
        <p className="mt-3 text-muted">
          After install, consistency is a predicate over every artifact — POLICY, SUITE, DAC,
          ugidfw, login labels, MAC overlay, splash — not a product of proofs. Propagate takes a
          revision. The ledger records it. This page is how you know the next iteration succeeded.
        </p>
      </header>

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
        <span className={cn("font-mono text-sm", report.ok ? "text-ok" : report.draft ? "text-warn" : "text-deny")}>
          {report.summary}
        </span>
        <span className="font-mono text-xs text-muted">
          catalog {shortHash(report.liveCatalog)} · revs {report.revs.length}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => dispatch({ type: "audit" })}>
            oneaudit
          </Button>
          <Button onClick={() => dispatch({ type: "propagate" })} disabled={!report.draft && report.revs.length > 0}>
            onepropagate
          </Button>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium tracking-tight">Consistency</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-3 py-3 font-medium">layer</th>
                <th className="px-3 py-3 font-medium">check</th>
                <th className="px-3 py-3 font-medium">status</th>
                <th className="px-3 py-3 font-medium">detail</th>
              </tr>
            </thead>
            <tbody>
              {report.checks.map((c) => (
                <tr key={c.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 font-mono text-xs text-muted">{c.layer}</td>
                  <td className="px-3 py-3 font-medium">{c.title}</td>
                  <td className={cn("px-3 py-3 font-mono text-xs", c.ok ? "text-ok" : c.severity === "fail" ? "text-deny" : "text-warn")}>
                    {c.ok ? "ok" : c.severity}
                  </td>
                  <td className="px-3 py-3 text-muted">{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium tracking-tight">What changed since last apply</h2>
        {changed.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
            Live catalog matches applied. No pending propagation.
          </p>
        ) : (
          <div className="grid gap-3">
            {changed.map((d) => (
              <article key={d.path} className="rounded-xl border border-border bg-surface p-4">
                <p className="font-mono text-sm text-fg">
                  {d.path}{" "}
                  <span className={d.status === "changed" ? "text-warn" : d.status === "added" ? "text-ok" : "text-deny"}>
                    {d.status}
                  </span>
                </p>
                {d.kv.length === 0 ? (
                  <p className="mt-2 font-mono text-xs text-muted">
                    {shortHash(d.hashFrom ?? "")} → {shortHash(d.hashTo ?? "")}
                  </p>
                ) : (
                  <ul className="mt-3 grid gap-1 font-mono text-xs">
                    {d.kv.map((kv) => (
                      <li key={kv.key} className="text-muted">
                        <span className="text-fg">{kv.key}</span>{" "}
                        <span className="text-deny">{kv.from ?? "∅"}</span>
                        {" → "}
                        <span className="text-ok">{kv.to ?? "∅"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium tracking-tight">Successive revisions</h2>
        <p className="text-sm text-muted">{report.revsCheck.reason}</p>
        <ol className="grid gap-2">
          {report.revs.map((r) => (
            <li key={r.seq} className="flex flex-wrap items-baseline justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-xs">
              <span className="text-fg">
                rev {r.seq} · {r.ts}
              </span>
              <span className="text-muted">
                policy {shortHash(r.policyHash)} · catalog {shortHash(r.catalogHash)}
              </span>
              <span className={r.fails ? "text-deny" : "text-ok"}>
                fails {r.fails} · warns {r.warns}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
