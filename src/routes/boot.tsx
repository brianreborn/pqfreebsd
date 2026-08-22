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
            oneboot is refused until you attest.
          </h1>
          <p className="mt-3 text-muted">
            The interesting part is the gate: do not take the loader off the unsigned GENERIC path
            on a box you do not yet trust. TPM and measured boot are not this pass. The splash mark
            is cosmetic and is not offered until the same attestation.
          </p>
        </header>
        <section className="rounded-xl border border-dashed border-border bg-surface p-6">
          <h2 className="font-medium">What this pass will and will not do</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            <li>Will: refuse oneboot while BOOT_SATISFIED is no (default).</li>
            <li>Will: after attestation, take the loader off unsigned GENERIC only as far as keys exist.</li>
            <li>Will not: TPM, measured boot, PCR quotes. Will not treat art as a signature family.</li>
          </ul>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => patch({ bootSatisfied: true })}>I am satisfied. Offer oneboot.</Button>
          <Button variant="ghost" asChild>
            <Link to="/code">Review A_auth of code first</Link>
          </Button>
        </div>
        <details className="rounded-xl border border-border bg-surface p-4">
          <summary className="cursor-pointer font-medium">Cosmetic mark (not the gate)</summary>
          <p className="mt-3 text-sm text-muted">
            After attestation, a Forth logo may replace the stock splash. Cross is the default.
            That is not T12.
          </p>
          <div className="mt-4">
            <ShieldBoot />
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-ok">T12 · attested · TPM not this pass</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">oneboot is offered. The loader gate is open for this pass.</h1>
        <p className="mt-3 text-muted">
          You attested. oneboot may take the loader off unsigned GENERIC as far as this pass can
          close. Measured boot remains held. The mark below is still not a signature.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-medium">oneboot (after attestation)</h2>
        <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`# refused unless BOOT_SATISFIED=YES
# TPM / measured boot: not this pass
loader_logo="pqfreebsd"
loader_brand="pqfreebsd"`}</pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => patch({ bootSatisfied: false })}>
            Revoke attestation
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/export">Emit, including oneboot</Link>
          </Button>
        </div>
      </section>

      <details className="rounded-xl border border-border bg-surface p-4">
        <summary className="cursor-pointer font-medium">Cosmetic mark (not the gate)</summary>
        <div className="mt-4">
          <ShieldBoot />
        </div>
      </details>
    </div>
  );
}
