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
          and SKILL.md. Exit 0 is not a proof. Then:
        </p>
        <pre className="mt-3 overflow-x-auto font-mono text-xs text-muted">{`make showconfig          # LOCALLLM group
# default: LLM OLLAMA LLAMACPP
pqfreebsd-llm-check
sysrc pqfreebsd_llm_attested=YES
service pqfreebsd teststage`}</pre>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-medium">Local GPU / CPU runtimes</h2>
        <p className="mt-2 text-sm text-muted">
          Native FreeBSD path is CPU and Vulkan. CUDA is typically Linuxulator, not a native
          NVIDIA stack. A binary on PATH is not “advanced.”
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="py-2 pr-3 font-medium">OPTION</th>
                <th className="py-2 pr-3 font-medium">Binary</th>
                <th className="py-2 font-medium">Where it runs</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">OLLAMA</td>
                <td className="py-2 pr-3 font-mono">ollama</td>
                <td className="py-2">CPU, Vulkan; CUDA often Linuxulator</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">LLAMACPP</td>
                <td className="py-2 pr-3 font-mono">llama-server</td>
                <td className="py-2">GGUF; CPU and GPU backends</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">LOCALAI</td>
                <td className="py-2 pr-3 font-mono">local-ai</td>
                <td className="py-2">OpenAI-compatible; wraps llama.cpp</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">LLAMAFILE</td>
                <td className="py-2 pr-3 font-mono">llamafile</td>
                <td className="py-2">Single-file GGUF; Cosmopolitan; FreeBSD</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">VLLM</td>
                <td className="py-2 pr-3 font-mono">vllm</td>
                <td className="py-2">GPU serving; CUDA typically Linuxulator</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3 font-mono text-fg">KOBOLDCPP</td>
                <td className="py-2 pr-3 font-mono">koboldcpp</td>
                <td className="py-2">llama.cpp server/GUI; CPU/GPU</td>
              </tr>
            </tbody>
          </table>
        </div>
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
