import { Link, createFileRoute } from "@tanstack/react-router";
import { boundFrontier, evaluateBounds, type BitBound } from "@/lib/pq/bounds";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bounds")({ component: Bounds });

function bits(b: BitBound) {
  return b === "n/a" ? "n/a" : String(b);
}

function Bounds() {
  const world = usePq((s) => s.world);
  const measures = evaluateBounds(world);
  const front = boundFrontier(measures);

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T16 · beta end · parameterized bounds</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          Provable up to these bounds. No further.
        </h1>
        <p className="mt-3 text-muted">
          At the end of beta, every claim we still make has a number — or an honest n/a. Classical
          PPT, qubit BQP (Grover, Shor, BHT), qudit / non-binary quantum, and continuous-variable
          machines are listed separately. A zero on one row does not zero the others (T14). This
          sheet is the remainder of the project: fill it as modules land; do not replace it with a
          slogan.
        </p>
        <p className="mt-3 font-mono text-sm text-muted">{front.summary}</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Measure</th>
              <th className="px-3 py-3 font-medium">Proves / up to</th>
              <th className="px-3 py-3 font-medium">Classical</th>
              <th className="px-3 py-3 font-medium">Qubit BQP</th>
              <th className="px-3 py-3 font-medium">Qudit</th>
              <th className="px-3 py-3 font-medium">CVQC</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((m) => (
              <tr key={m.id} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <p className="font-medium">{m.measure}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
                    {m.claim} · {m.kind} · {m.live}
                  </p>
                </td>
                <td className="px-3 py-3 text-muted">
                  <p>{m.proves}</p>
                  <p className="mt-2 text-xs">Up to: {m.upto}</p>
                </td>
                <Cell bits={m.classical.bits} note={m.classical.note} />
                <Cell bits={m.qubit.bits} note={m.qubit.note} />
                <Cell bits={m.qudit.bits} note={m.qudit.note} />
                <Cell bits={m.cvqc.bits} note={m.cvqc.note} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="max-w-3xl text-sm text-muted">
        Bits already include birthday (collision) and Grover/BHT where they apply. n/a means the
        measure is not a cryptographic game. 0 means the particular is broken or missing under that
        adversary — not that write-up failed. Assumptions are named so they can be replaced.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/claims">Claims</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/code">Chain of trust</Link>
        </Button>
      </div>
    </div>
  );
}

function Cell({ bits: b, note }: { bits: BitBound; note: string }) {
  const zero = b === 0;
  const na = b === "n/a";
  return (
    <td className="px-3 py-3">
      <p className={cn("font-mono text-sm", zero ? "text-deny" : na ? "text-muted" : "text-fg")}>{bits(b)}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </td>
  );
}
