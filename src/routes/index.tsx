import { Link, createFileRoute } from "@tanstack/react-router";
import { SkillGraph } from "@/components/skill-graph";
import { ShieldBoot } from "@/components/shield-boot";
import { Button } from "@/components/ui/button";
import { THESES } from "@/lib/pq/paper";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="grid gap-12">
      <section className="grid gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          PQFreeBSD · Freely Blessed · pqac(7)
        </p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.03em] text-fg md:text-5xl">
          pq all the things
        </h1>
        <p className="max-w-prose text-muted">
          A composition of mandatory policies — integrity labels, file-firewall rules, capability
          mode, repaired access matrix, evidence chain — some of which load through the MAC
          Framework and some of which do not. Mediation does not collapse under Shor; RSA hops
          still might. Agents enter capability mode with a workspace fd opened first. Claims
          degrade by conjunct. Unlike layers do not share a namei race. A federation of unlike
          validators adds channel, not bits on a package signature.
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

      <section className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-medium tracking-tight">Loader splash (Forth preview)</h2>
          <Button variant="ghost" asChild>
            <Link to="/boot">Boot gate</Link>
          </Button>
        </div>
        <ShieldBoot />
      </section>

      <section className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-medium tracking-tight">Theses</h2>
          <Button variant="ghost" asChild>
            <Link to="/paper">Paper</Link>
          </Button>
        </div>
        <p className="text-sm text-muted">
          {THESES.filter((t) => t.kind === "pqfreebsd").length} of this suite,{" "}
          {THESES.filter((t) => t.kind === "inherited").length} inherited from pqac(7),{" "}
          {THESES.filter((t) => t.kind === "held").length} held. Lemmas T20–T21 are in the paper.
        </p>
      </section>
    </div>
  );
}
