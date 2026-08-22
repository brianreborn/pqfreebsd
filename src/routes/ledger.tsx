import { createFileRoute } from "@tanstack/react-router";
import { resultColor, verifyChain } from "@/lib/pq/host";
import { shortHash } from "@/lib/pq/sha256";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: Ledger });

function Ledger() {
  const world = usePq((s) => s.world);
  const dispatch = usePq((s) => s.dispatch);
  const v = verifyChain(world.ledger);
  const head = world.nodes["/pq/ledger/HEAD"];

  return (
    <div className="grid gap-6">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T7 · Integrity Evidence</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">The chain is the monitor's evidence.</h1>
        <p className="mt-3 text-muted">
          audit(4) names the in-band source. This log is the Merkle evidence: prevHash ‖ canonical
          event → SHA-256. Production uses SHA-512 against Grover. The dataset is high. Rewrite is
          a bug; rotation would append a checkpoint record.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "rounded-md border border-border px-3 py-2 font-mono text-sm",
            v.ok ? "text-ok" : "text-deny",
          )}
        >
          {v.ok ? "chain intact" : v.reason}
        </span>
        <Button variant="ghost" onClick={() => dispatch({ type: "verify" })}>
          verify
        </Button>
        <Button variant="danger" onClick={() => dispatch({ type: "tamper", seq: Math.max(0, world.ledger.length - 2) })}>
          tamper last-but-one
        </Button>
        <p className="text-sm text-muted">
          HEAD {head?.content} · {world.policy.ledgerDataset}
        </p>
      </div>

      <ol className="grid gap-2">
        {[...world.ledger].reverse().map((e) => (
          <li key={e.hash} className="rounded-lg border border-border bg-surface px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
              <span>
                <span className="text-subtle">#{e.seq}</span>{" "}
                <span className={resultColor(e.result)}>{e.result}</span> {e.op} · {e.subject} → {e.object}
              </span>
              <span className="text-muted tabular-nums">{e.ts}</span>
            </div>
            <p className="mt-2 text-sm text-fg">{e.detail}</p>
            <p className="mt-2 font-mono text-[11px] text-subtle">
              {shortHash(e.prevHash, 10)} → {shortHash(e.hash, 16)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
