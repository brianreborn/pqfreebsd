import { Link, createFileRoute } from "@tanstack/react-router";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/capsicum")({ component: Capsicum });

function Capsicum() {
  const on = usePq((s) => s.world.policy.withCapsicum);
  const actor = usePq((s) => s.world.subjects[s.world.actor]);
  const patch = usePq((s) => s.patchPolicy);
  const dispatch = usePq((s) => s.dispatch);

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">T18 · GENERIC · not MAC</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          Low-integrity agents drop the ambient namespace.
        </h1>
        <p className="mt-3 max-w-prose text-muted">
          Capsicum is in GENERIC (<span className="font-mono">options CAPABILITY_MODE</span>). After{" "}
          <span className="font-mono">cap_enter</span>, a process may operate only on descriptors it
          already holds. mac_lomac(4) stops write-up. Capsicum stops a new open. Those are
          independent predicates. A quantum algorithm is not a substitute for either.
        </p>
        <p className="mt-2 max-w-prose text-muted">
          Paper: Watson, Anderson, Laurie, Kennaway,{" "}
          <a className="underline" href="http://www.trustedbsd.org/2010usenix-security-capsicum-website.pdf">
            Capsicum: practical capabilities for UNIX
          </a>
          , USENIX Security 2010 — not in the base man set as a design document.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium">Composed in this suite</p>
          <span className={cn("font-mono text-xs", on ? "text-ok" : "text-warn")}>
            {on ? "withCapsicum=YES" : "silent (lattice still independent)"}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">
          First pass: <span className="font-mono">pqcap-enter</span> does caph_limit_stdio, caph_enter,
          exec. Casper is later, like ipfw after ugidfw-shaped rules. Do not wrap sshd or login.
        </p>
        <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`pqcap-enter /usr/local/libexec/headroom-agent …
# testenter: pqcap-enter /usr/bin/true`}</pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant={on ? "ghost" : "primary"} onClick={() => patch({ withCapsicum: !on })}>
            {on ? "Silence Capsicum conjunct" : "Compose Capsicum"}
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: "cap_enter" })}>
            cap_enter ({actor?.name})
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/host">Drive as an agent</Link>
          </Button>
        </div>
        {actor?.capabilityMode ? (
          <p className="mt-3 font-mono text-xs text-ok">
            {actor.name} is in capability mode. Opens outside /home/{actor.name} and /tmp are denied.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-medium">Independent of the lattice</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          <li>A low-integrity process without cap_enter can still open new paths (and then fail write-up).</li>
          <li>A high-integrity process that cap_enter’s cannot open new paths either — rare; we wrap agents.</li>
          <li>Missing Capsicum does not un-prove high-integrity overwrite protection (T14, T19).</li>
          <li>It is not a jail, not ipfw, not MAC, not Casper yet.</li>
        </ul>
      </section>
    </div>
  );
}
