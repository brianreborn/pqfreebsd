import { Link, createFileRoute } from "@tanstack/react-router";
import { SkillGraph } from "@/components/skill-graph";
import { Button } from "@/components/ui/button";
import { THESES } from "@/lib/pq/paper";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="grid gap-12">
      <section className="grid gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          derived from freebsd-mac-grok · pqac(7)
        </p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.03em] text-fg md:text-5xl">
          Post-quantum access control is mediation, not Kyber.
        </h1>
        <p className="max-w-prose text-muted">
          Shor destroys a name. It does not inhabit chmod, a LOMAC label, or a PTE. This pass adds
          a filesystem Integrity Evidence ledger and a discretionary matrix that is established at
          create and repaired on drift. Payload confirmation, code signatures, ZFS send
          authentication, and SEBSD are held: the monitor is PQ-stable; the bits it interprets are
          not yet.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/paper">Read the paper</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/host">Drive the host</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/code">A_auth of code</Link>
          </Button>
        </div>
      </section>

      <SkillGraph />

      <section className="grid gap-4">
        <h2 className="text-lg font-medium tracking-tight">Ten theses, one of them held</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {THESES.map((t) => (
            <article
              key={t.id}
              className={
                t.kind === "held"
                  ? "rounded-lg border border-dashed border-border bg-bg p-4"
                  : "rounded-lg border border-border bg-surface p-4"
              }
            >
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t.id} · {t.kind === "inherited" ? "pqac(7)" : t.kind === "held" ? "held" : "pqfreebsd(7)"}
              </p>
              <h3 className="mt-2 font-medium text-fg">{t.title}</h3>
              <p className="mt-2 text-sm text-muted">{t.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
