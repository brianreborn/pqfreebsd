import { createFileRoute } from "@tanstack/react-router";
import { claimTally, evaluateClaims, type ClaimStatus } from "@/lib/pq/claims";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/claims")({ component: Claims });

const TONE: Record<ClaimStatus, string> = {
  holds: "text-ok",
  degraded: "text-warn",
  silent: "text-muted",
  held: "text-subtle",
  broken: "text-deny",
};

function Claims() {
  const world = usePq((s) => s.world);
  const dispatch = usePq((s) => s.dispatch);
  const patch = usePq((s) => s.patchPolicy);
  const claims = evaluateClaims(world);
  const tally = claimTally(claims);

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T14 · piecemeal claims</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          A missing conjunct is a missing claim, not a false remainder.
        </h1>
        <p className="mt-3 text-muted">
          Security claims degrade by module. If you are network-stranded and cannot securely
          transport the ledger to another host, the off-host IE claim is weakened. Write-up,
          local chain, repaired A_D, and the rest are not. A deployment that includes and
          enables that protocol, and adheres to it, keeps the claim. Do not report the suite
          as a single bit.
        </p>
      </header>

      <section className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-ok">holds {tally.holds}</span>
        <span className="text-warn">degraded {tally.degraded}</span>
        <span className="text-deny">broken {tally.broken}</span>
        <span className="text-muted">silent {tally.silent}</span>
        <span className="text-subtle">held {tally.held}</span>
      </section>

      <section className="grid gap-3 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-medium">Replica protocol (the example)</h2>
        <p className="text-sm text-muted">
          Include the module, name a peer, transport when you can. Strand the net to see one
          claim degrade and the others stay.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={world.policy.replicaEnabled ? "primary" : "ghost"}
            onClick={() => patch({ replicaEnabled: !world.policy.replicaEnabled, replicaPeer: world.policy.replicaPeer || "ie-peer" })}
          >
            {world.policy.replicaEnabled ? "replica included" : "include replica"}
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: "strand", on: !world.stranded })}>
            {world.stranded ? "stranded" : "on-net"}
          </Button>
          <Button onClick={() => dispatch({ type: "replicate" })}>transport ledger</Button>
        </div>
        <p className="font-mono text-xs text-muted">
          peer {world.policy.replicaPeer || "(none)"} · replicaOk {String(world.replicaOk)} · stranded{" "}
          {String(world.stranded)}
        </p>
      </section>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">module</th>
              <th className="px-3 py-3 font-medium">claim</th>
              <th className="px-3 py-3 font-medium">status</th>
              <th className="px-3 py-3 font-medium">this box</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="border-t border-border align-top">
                <td className="px-3 py-3 font-mono text-xs text-muted">
                  {c.module}
                  <span className="mt-1 block text-[10px] uppercase tracking-wide">{c.thesis}</span>
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted">{c.holdsWhen}</p>
                </td>
                <td className={cn("px-3 py-3 font-mono text-xs uppercase", TONE[c.status])}>{c.status}</td>
                <td className="px-3 py-3 text-muted">{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
