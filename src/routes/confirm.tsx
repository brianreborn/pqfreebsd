import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/confirm")({ component: Confirm });

function Confirm() {
  return (
    <div className="mx-auto grid max-w-2xl gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-warn">T10 · held · not this pass</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          Data must itself have integrity that can be confirmed, to a certain extent.
        </h1>
        <p className="mt-3 text-muted">
          Required of the system. Deliberately not implemented here. The node stays dashed on the
          graph until a later skill, pqconfirm, carries it.
        </p>
      </header>

      <section className="rounded-xl border border-dashed border-border bg-surface p-6">
        <h2 className="font-medium">What would be confirmed</h2>
        <p className="mt-3 text-sm text-muted">
          LOMAC says a sandbox cannot write-up. The ledger says a write happened, in order, under a
          hash of events. Neither lets green, later, confirm that the bytes in{" "}
          <span className="font-mono text-fg">/home/green/notes</span> are the bytes that were
          written. That is payload integrity, not event integrity, not access-matrix integrity.
        </p>
        <p className="mt-3 text-sm text-muted">
          ZFS checksums already detect silent corruption inside the pool. They are not a
          subject-visible confirmation API, and a scrub is not a Merkle proof a process can ask
          for. Do not pretend they discharge T10.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-medium">To a certain extent</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          <li>A content digest, or a Merkle over the labeled store, bound to a ledger checkpoint.</li>
          <li>Confirmable to the extent of the hash. Grover halves the bits. Production: SHA-512 or SHA-3.</li>
          <li>Not information-theoretic. Not Faraday. Not a secrecy lattice.</li>
          <li>The confirmer is a subject. T4 still applies. High objects, high ledger.</li>
          <li>Conjunction with A_M and the event ledger is still not a product of proofs.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-medium">What this pass will not do</h2>
        <p className="mt-3 text-sm text-muted">
          No per-file digest on write. No Merkle of /home. No zfs send verify wrapped as a MAC
          hook. No kldload of a verifier. The skill graph records the requirement so it cannot be
          mistaken for a feature we shipped. When pqconfirm is written, it interviews, emits, and
          walks Known issues like the others — test* before one*.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Back to the graph</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/ledger">What the ledger does confirm</Link>
        </Button>
      </div>
    </div>
  );
}
