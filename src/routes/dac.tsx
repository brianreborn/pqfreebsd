import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { findDrift } from "@/lib/pq/dac";
import { formatMode } from "@/lib/pq/policy";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import type { DacMode } from "@/lib/pq/types";

export const Route = createFileRoute("/dac")({ component: Dac });

function Dac() {
  const world = usePq((s) => s.world);
  const dispatch = usePq((s) => s.dispatch);
  const patch = usePq((s) => s.patchPolicy);
  const drift = findDrift(world.nodes, world.rules);
  const [pattern, setPattern] = useState("^/home/green/secret");
  const [owner, setOwner] = useState("green");

  return (
    <div className="grid gap-6">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T6 · restricted A_D</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Establish. Drift. Repair.</h1>
        <p className="mt-3 text-muted">
          First-match path-regex → owner, group, mode. Not a lattice join. Not MAC. chmod remains
          owner-directed; the morphism bounds how long a grant the lattice would refuse can stand.
          Empty ugidfw is still allow-all.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["observe", "repair", "prevent"] as DacMode[]).map((m) => (
          <Button key={m} variant={world.policy.dacMode === m ? "primary" : "ghost"} onClick={() => patch({ dacMode: m })}>
            {m}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => dispatch({ type: "establish" })}>
          oneestablish
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "repair" })}>
          onerepair
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="font-medium">testdrift</h2>
        {drift.length === 0 ? (
          <p className="mt-3 text-sm text-ok">No drift against the first-match spec.</p>
        ) : (
          <ul className="mt-3 grid gap-2 font-mono text-sm">
            {drift.map((d) => (
              <li key={`${d.path}:${d.field}`} className="text-warn">
                {d.path} {d.field} {d.actual} → {d.intended}{" "}
                <span className="text-muted">({d.ruleId})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">id</th>
              <th className="px-4 py-3 font-medium">pattern</th>
              <th className="px-4 py-3 font-medium">owner:group</th>
              <th className="px-4 py-3 font-medium">dir / file</th>
            </tr>
          </thead>
          <tbody>
            {world.rules.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-2 font-mono">{r.id}</td>
                <td className="px-4 py-2 font-mono text-muted">{r.pattern}</td>
                <td className="px-4 py-2">
                  {r.owner}:{r.group}
                </td>
                <td className="px-4 py-2 font-mono">
                  {formatMode(r.dirMode)} / {formatMode(r.fileMode)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form
        className="grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-[1fr_8rem_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "addRule",
            rule: {
              id: pattern.replace(/[^a-z0-9]+/gi, "-").slice(0, 24) || "site",
              pattern,
              owner,
              group: owner,
              dirMode: 0o700,
              fileMode: 0o600,
            },
          });
        }}
      >
        <input
          className="min-h-11 rounded-md border border-border bg-bg px-3 font-mono text-sm"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          aria-label="rule pattern"
        />
        <input
          className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          aria-label="owner"
        />
        <Button type="submit">Prepend overlay</Button>
      </form>
    </div>
  );
}
