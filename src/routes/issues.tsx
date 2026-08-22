import { createFileRoute } from "@tanstack/react-router";
import { ISSUES } from "@/lib/pq/issues";

export const Route = createFileRoute("/issues")({ component: Issues });

function Issues() {
  return (
    <div className="grid gap-6">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Known issues · do not strip</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Walk these before oneenforce.</h1>
        <p className="mt-3 text-muted">
          Inherited from freebsd-mac-grok READMEs (Handbook ch.19, mailing lists, PRs) plus the
          ledger and A_D residue. The skill must leave this catalog in the result README. MAC
          papers:{" "}
          <a className="underline" href="http://www.trustedbsd.org/docs.html">
            TrustedBSD docs
          </a>
          .
        </p>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">layer</th>
              <th className="px-4 py-3 font-medium">issue</th>
              <th className="px-4 py-3 font-medium">happens</th>
              <th className="px-4 py-3 font-medium">this package</th>
            </tr>
          </thead>
          <tbody>
            {ISSUES.map((i) => (
              <tr key={i.id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {i.layer}
                  <div className="mt-1 max-w-[9rem] text-[11px] leading-snug">{i.source}</div>
                </td>
                <td className="px-4 py-3 font-medium">{i.issue}</td>
                <td className="px-4 py-3 text-muted">{i.happens}</td>
                <td className="px-4 py-3">{i.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
