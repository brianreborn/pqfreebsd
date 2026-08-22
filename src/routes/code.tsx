import { Link, createFileRoute } from "@tanstack/react-router";
import { AUTH_CLAIM, CODE_AUTH } from "@/lib/pq/code-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/code")({ component: CodeAuth });

const STATUS: Record<(typeof CODE_AUTH)[number]["status"], string> = {
  unsigned: "unsigned",
  classical: "classical (Shor)",
  "hash-only": "hash only (Grover)",
  "held-pq": "held",
};

function CodeAuth() {
  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-warn">T11 · A_auth of code · held</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          The monitor is PQ-stable. The bits it interprets are not yet.
        </h1>
        <p className="mt-3 max-w-prose text-muted">{AUTH_CLAIM}</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Subsystem</th>
              <th className="px-3 py-3 font-medium">Authenticates</th>
              <th className="px-3 py-3 font-medium">Today</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Redundancy</th>
            </tr>
          </thead>
          <tbody>
            {CODE_AUTH.map((row) => (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="px-3 py-3 font-medium text-fg">{row.subsystem}</td>
                <td className="px-3 py-3 text-muted">{row.authenticates}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted">
                  {row.algorithm === "—" ? row.today : `${row.today} · ${row.algorithm}`}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      row.status === "unsigned"
                        ? "text-deny"
                        : row.status === "classical"
                          ? "text-warn"
                          : row.status === "held-pq"
                            ? "text-muted"
                            : "text-fg"
                    }
                  >
                    {STATUS[row.status]}
                  </span>
                </td>
                <td className="px-3 py-3 text-muted">{row.redundancy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="grid gap-3">
        {CODE_AUTH.map((row) => (
          <article key={row.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{row.subsystem}</p>
            <p className="mt-2 text-sm text-muted">{row.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-dashed border-border bg-surface p-6">
        <h2 className="font-medium">Held skills — not created until you say so</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          <li>
            <span className="font-medium text-fg">pqcode</span> — sign kernel, kld, policy, and the
            emitted result tree with ML-DSA and SLH-DSA. Two families is the redundancy. Do not kldload
            Kyber; this is A_auth of code, the game T2 set aside.
          </li>
          <li>
            <span className="font-medium text-fg">pqzfs</span> — sha512 (not fletcher) on labeled
            datasets; Merkle bound to ledger checkpoints;{" "}
            <span className="font-mono text-fg">zfs send</span> refused unless the stream carries a PQ
            signature; AES-256 wrapping that is never RSA; compose parent{" "}
            <span className="font-mono">snapshot -r</span>.
          </li>
          <li>
            <span className="font-medium text-fg">mac-sebsd</span> — FLASK/TE. Unsigned policy is
            unsigned code-equivalent. A TE skill without pqcode is a slogan.
          </li>
          <li>
            <span className="font-medium text-fg">pqconfirm</span> — payload digest. Hash confirmation
            is T10; a signature over the Merkle root is T11.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Back to the graph</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/confirm">T10 payload</Link>
        </Button>
      </div>
    </div>
  );
}
