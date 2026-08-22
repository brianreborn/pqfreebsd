import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/port")({ component: Port });

function Port() {
  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">sysutils/pqfreebsd · via-port</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          A port that will not pretend a pkg is the operator.
        </h1>
        <p className="mt-3 text-muted">
          After the skills exist, install is <span className="font-mono text-fg">sysutils/pqfreebsd</span>.
          It stages rc.d, man, Forth, and SKILL.md. It does not kldload. Intended operation is by a
          sufficiently advanced LLM that can follow those skills. The port cannot prove
          “advanced.” It requires attestation. That conjunct is the install path, not A_M (T14).
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-medium">What “sufficiently advanced” means here</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          <li>Runs the interview and writes POLICY without inventing compartments.</li>
          <li>Offers test* immediately before each one*.</li>
          <li>Walks Known issues and pqac(7) PRAXIS before oneenforce.</li>
          <li>Reports T14 (claims by conjunct) and T16 (parameterized bounds).</li>
          <li>Refuses oneboot until BOOT_SATISFIED=YES; refuses kldload in the interview.</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          <span className="font-mono text-fg">pqfreebsd-llm-check</span> looks for a candidate
          (PQFREEBSD_LLM, grok, llm, ollama, …) and SKILL.md. Exit 0 is not a proof. Then:
        </p>
        <pre className="mt-3 overflow-x-auto font-mono text-xs text-muted">{`pqfreebsd-llm-check
sysrc pqfreebsd_llm_attested=YES
service pqfreebsd teststage`}</pre>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-medium">Build from this tree</h2>
        <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`# copy or mount this directory as /usr/ports/sysutils/pqfreebsd
cd /usr/ports/sysutils/pqfreebsd
make showconfig          # LLM on by default
make install clean       # stages; does not enforce
# oneenforce refused until llm attested (via-port only)`}</pre>
        <p className="mt-4 text-sm text-muted">
          Hand install from the skill tree does not set VIA-PORT; that path is for an operator
          already using the skills. The port is for “pkg install the suite, then let the model
          operate it.”
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/interview">Interview</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/bounds">Bounds</Link>
        </Button>
      </div>
    </div>
  );
}
