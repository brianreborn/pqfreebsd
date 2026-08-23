import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldBoot } from "@/components/shield-boot";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/boot")({ component: Boot });

function Boot() {
  const satisfied = usePq((s) => s.world.policy.bootSatisfied);
  const emblem = usePq((s) => s.world.policy.splashEmblem ?? "cross");
  const patch = usePq((s) => s.patchPolicy);

  return (
    <div className="grid gap-8">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          loader.efi · logo-pqfreebsd.4th
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Boot splash</h1>
        <p className="mt-3 text-muted">
          Forth ASCII and ANSI, same geometry as the loader script. Cross is the default device;
          dove, sword, crown, menorah, and rock are options. The <em>claim</em> is still the gate:
          oneboot is refused until you attest. Art is not a signature family. TPM is not this pass.
        </p>
      </header>

      <ShieldBoot />

      <section className="rounded-xl border border-border bg-surface p-6">
        {satisfied ? (
          <>
            <p className="text-xs uppercase tracking-[0.16em] text-ok">T12 · attested</p>
            <h2 className="mt-2 font-medium">oneboot is offered</h2>
            <p className="mt-2 text-sm text-muted">
              The loader may leave unsigned GENERIC only as far as this pass can close. Measured
              boot remains held.
            </p>
            <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`# BOOT_SATISFIED=YES
loader_logo="pqfreebsd"
loader_brand="pqfreebsd"
pqfreebsd_emblem="${emblem}"`}</pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => patch({ bootSatisfied: false })}>
                Revoke attestation
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/export">Emit, including oneboot</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.16em] text-warn">T12 · gated</p>
            <h2 className="mt-2 font-medium">oneboot is refused until you attest</h2>
            <p className="mt-2 text-sm text-muted">
              Preview the mark now. Installing it on a host still waits on attestation. Do not take
              the loader off unsigned GENERIC on a box you do not yet trust.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => patch({ bootSatisfied: true })}>I am satisfied. Offer oneboot.</Button>
              <Button variant="ghost" asChild>
                <Link to="/code">Review A_auth of code first</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
