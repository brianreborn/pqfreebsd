import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import roles from "../../docs/swarm-roles.json";

export const Route = createFileRoute("/swarm")({ component: Swarm });

function Swarm() {
  const list = Object.entries(roles.roles) as [
    string,
    { integrity: string; cap_enter: boolean; may: string[]; must_not: string[] },
  ][];

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T22 · requirements</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Swarm conductor</h1>
        <p className="mt-3 text-muted">
          A role is only a starting set of capabilities. The conductor dispatches; it does not
          implement, build, or sign. Overlay of{" "}
          <a className="underline" href="https://github.com/brianreborn/japanglify/tree/main/docs/swarm-conductor">
            japanglify docs/swarm-conductor
          </a>
          — no linguistics, no Android /uat. Workers enter capability mode. GitHub is the mailbox,
          not the TCB.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Role</th>
              <th className="px-3 py-3 font-medium">Integrity</th>
              <th className="px-3 py-3 font-medium">cap_enter</th>
              <th className="px-3 py-3 font-medium">may</th>
              <th className="px-3 py-3 font-medium">must not</th>
            </tr>
          </thead>
          <tbody>
            {list.map(([name, r]) => (
              <tr key={name} className="border-t border-border align-top">
                <td className="px-3 py-3 font-mono text-xs">{name}</td>
                <td className="px-3 py-3">{r.integrity}</td>
                <td className="px-3 py-3 font-mono text-xs">{r.cap_enter ? "yes --root" : "no"}</td>
                <td className="px-3 py-3 text-muted">{r.may.join(", ")}</td>
                <td className="px-3 py-3 text-muted">{r.must_not.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="max-w-prose text-sm text-muted">
        <code>may</code> is DAC-shaped (starting set). <code>must_not</code> is MAC-shaped (cannot
        elect away). <code>ledger.append</code> is on every role. Do not stack conductor and bench.
        Matrix: <Link to="/paper">T22</Link>. Spec: docs/swarm-conductor.md.
      </p>
      <div>
        <Button variant="ghost" asChild>
          <Link to="/capsicum">Capsicum contract</Link>
        </Button>
      </div>
    </div>
  );
}
