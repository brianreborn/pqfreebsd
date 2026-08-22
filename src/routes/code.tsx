import { Link, createFileRoute } from "@tanstack/react-router";
import { AUTH_CLAIM, CODE_AUTH, chainBreak } from "@/lib/pq/code-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/code")({ component: CodeAuth });

const STATUS: Record<(typeof CODE_AUTH)[number]["status"], string> = {
  unsigned: "unsigned",
  classical: "classical (Shor)",
  hybrid: "hybrid (transition)",
  "hash-only": "hash only (Grover)",
  "held-pq": "PQ (eventual)",
};

function CodeAuth() {
  const brk = chainBreak();
  const ordered = [...CODE_AUTH].sort((a, b) => a.hop - b.hop);

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-warn">T11 · T15 · catalog · not a 1.0 gate</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          The chain must be unbroken. Every cryptographic particular must become post-quantum.
        </h1>
        <p className="mt-3 max-w-prose text-muted">{AUTH_CLAIM}</p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <p className={brk.unbroken ? "font-mono text-sm text-ok" : "font-mono text-sm text-deny"}>{brk.reason}</p>
        <ol className="mt-4 grid gap-2">
          {ordered.map((row) => {
            const brokenHere = brk.at?.id === row.id;
            return (
              <li
                key={row.id}
                className={cn(
                  "grid gap-1 rounded-md border px-3 py-3 md:grid-cols-[3rem_1fr_auto]",
                  brokenHere ? "border-deny/40 bg-bg" : "border-border",
                )}
              >
                <span className="font-mono text-xs text-muted">hop {row.hop}</span>
                <span>
                  <span className="font-medium">{row.subsystem}</span>
                  <span className="mt-1 block text-xs text-muted">{row.pqReplace}</span>
                </span>
                <span
                  className={cn(
                    "font-mono text-xs",
                    row.status === "unsigned" || brokenHere
                      ? "text-deny"
                      : row.status === "classical" || row.status === "hybrid"
                        ? "text-warn"
                        : row.status === "held-pq"
                          ? "text-ok"
                          : "text-muted",
                  )}
                >
                  {STATUS[row.status]}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Hop</th>
              <th className="px-3 py-3 font-medium">Today</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">PQ replacement</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row) => (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <p className="font-medium text-fg">
                    {row.hop}. {row.subsystem}
                  </p>
                  <p className="mt-1 text-xs text-muted">{row.authenticates}</p>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-muted">
                  {row.algorithm === "—" ? row.today : `${row.today} · ${row.algorithm}`}
                </td>
                <td className="px-3 py-3 font-mono text-xs">
                  <span
                    className={
                      row.status === "unsigned"
                        ? "text-deny"
                        : row.status === "classical" || row.status === "hybrid"
                          ? "text-warn"
                          : row.status === "held-pq"
                            ? "text-ok"
                            : "text-fg"
                    }
                  >
                    {STATUS[row.status]}
                  </span>
                  <p className="mt-1 text-muted">{row.redundancy}</p>
                </td>
                <td className="px-3 py-3 text-muted">{row.pqReplace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-dashed border-border bg-surface p-6">
        <h2 className="font-medium">Held skills — not created until you say so</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          <li>
            <span className="font-medium text-fg">pqcode</span> — close hops 2–7: kernel, kld, pkg,
            update, policy, rc.d. Two families. Hybrid only as a named transition, then remove RSA.
          </li>
          <li>
            <span className="font-medium text-fg">pqzfs</span> — hops 9–11: sha512 not fletcher; send
            dual-signed; wrapping never RSA.
          </li>
          <li>
            <span className="font-medium text-fg">pqledger-replica</span> — hop 12: ML-KEM + dual
            signatures on the transport. T14 still applies when stranded.
          </li>
          <li>
            <span className="font-medium text-fg">mac-sebsd</span> — TE. Unsigned policy is hop 6.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/claims">Claims (T14)</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/confirm">T10 payload</Link>
        </Button>
      </div>
    </div>
  );
}
