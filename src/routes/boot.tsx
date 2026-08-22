import { Link, createFileRoute } from "@tanstack/react-router";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/boot")({ component: Boot });

function Boot() {
  const satisfied = usePq((s) => s.world.policy.bootSatisfied);
  const patch = usePq((s) => s.patchPolicy);

  if (!satisfied) {
    return (
      <div className="mx-auto grid max-w-2xl gap-8">
        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-warn">T12 · gated · TPM not this pass</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">
            The splash is not a sticker you put on an untrusted box.
          </h1>
          <p className="mt-3 text-muted">
            Once you are sufficiently satisfied that the system is post-quantum hardened to the
            degree that gives you a sense of security, the umbrella may secure the bootloader —
            without TPM this pass — replace the name on the splash with pqfreebsd, and replace the
            beastie with the shield, the armor of God. Until you attest, the daemon stays. Default
            is no.
          </p>
        </header>
        <section className="rounded-xl border border-dashed border-border bg-surface p-6">
          <h2 className="font-medium">What this pass will and will not do</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted">
            <li>Will: brand.4th / loader.conf so the menu reads pqfreebsd.</li>
            <li>Will: replace the beastie with the steel shield on the splash.</li>
            <li>Will: take the loader off the unsigned GENERIC path only as far as keys exist (see Code).</li>
            <li>Will not: TPM, measured boot, PCR quotes. That is a later skill.</li>
            <li>Will not: claim the firmware db is two signature families.</li>
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
          You attested. The mark is the armor of the trusted base — mediation, evidence, signed
          bits — not a sticker that says “access control.” Measured boot remains held.
        </p>
      </header>

      <figure className="overflow-hidden rounded-xl border border-border bg-surface">
        <img
          src="/splash.jpg"
          alt="pqfreebsd boot splash: steel shield, post-quantum trusted FreeBSD, TPM not this pass"
          className="h-auto w-full"
          width={1792}
          height={1008}
        />
        <figcaption className="px-4 py-3 text-xs text-muted">
          Splash mock. Name replaced. Beastie replaced by the shield. Footer states the TPM gap so it
          cannot be mistaken for a feature we shipped.
        </figcaption>
      </figure>

      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <figure className="overflow-hidden rounded-xl border border-border bg-surface p-6">
          <img
            src="/shield.jpg"
            alt="Heraldic steel shield, the armor of God, boot mark"
            className="mx-auto h-auto w-full max-w-[12rem]"
            width={1408}
            height={1408}
          />
        </figure>
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-medium">oneboot (after attestation)</h2>
          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted">{`# /boot/loader.conf.local — emitted only if BOOT_SATISFIED=YES
loader_color="YES"
beastie_disable="NO"
loader_logo="pqfreebsd"
# brand-pqfreebsd.4th draws the shield, not the daemon
# TPM / measured boot: not this pass
# If no PQ code-signing keys exist, oneboot refuses and says so`}</pre>
          <p className="mt-4 text-sm text-muted">
            Securing the loader without TPM means: signed loader+kernel object if pqcode keys exist,
            branding always. It does not mean PCRs. Do not call firmware RSA a second family.
          </p>
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
    </div>
  );
}
