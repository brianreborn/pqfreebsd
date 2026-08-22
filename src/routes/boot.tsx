import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldBoot } from "@/components/shield-boot";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/boot")({ component: Boot });

function Boot() {
  const satisfied = usePq((s) => s.world.policy.bootSatisfied);
  const patch = usePq((s) => s.patchPolicy);

  if (!satisfied) {
    return (
      <div className="grid gap-8">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-warn">T12 · gated · TPM not this pass</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">
            The splash is not a sticker you put on an untrusted box.
          </h1>
          <p className="mt-3 text-muted">
            The loader is Forth. When you attest, oneboot installs logo-pqfreebsd.4th: ASCII shield
            over a sword, ANSI gleam, then the menu. Until then the daemon stays. Default is no.
          </p>
        </header>
        <ShieldBoot />
        <section className="rounded-xl border border-dashed border-border bg-surface p-6">
          <h2 className="font-medium">What this pass will and will not do</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            <li>Will: brand-pqfreebsd.4th / logo-pqfreebsd.4th (ASCII + SGR animation).</li>
            <li>Will: loader.conf so the menu reads pqfreebsd, beastie gone.</li>
            <li>Will not: TPM, measured boot, PCR quotes.</li>
          </ul>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => patch({ bootSatisfied: true })}>I am satisfied. Offer oneboot.</Button>
          <Button variant="ghost" asChild>
            <Link to="/code">Review A_auth of code first</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-ok">T12 · attested · TPM not this pass</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">pqfreebsd on the splash. The shield, not the beastie.</h1>
        <p className="mt-3 text-muted">
          logo-pqfreebsd.4th plays in loader.efi: sword, heater, gleam, wordmark. Serial still gets
          the ASCII. Measured boot remains held.
        </p>
      </header>

      <ShieldBoot />

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-medium">oneboot (after attestation)</h2>
        <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`loader_color="YES"
loader_logo="pqfreebsd"
loader_brand="pqfreebsd"
# /boot/logo-pqfreebsd.4th  ASCII shield + sword + SGR
# /boot/brand-pqfreebsd.4th wordmark
# TPM / measured boot: not this pass`}</pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => patch({ bootSatisfied: false })}>
            Revoke attestation
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/export">Emit, including oneboot</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
