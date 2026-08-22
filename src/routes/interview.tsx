import { Link, createFileRoute } from "@tanstack/react-router";
import { INTERVIEW } from "@/lib/pq/policy";
import { usePq } from "@/lib/pq/store";
import type { DacMode, Policy } from "@/lib/pq/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interview")({ component: Interview });

function Interview() {
  const world = usePq((s) => s.world);
  const step = usePq((s) => s.interviewStep);
  const setStep = usePq((s) => s.setInterviewStep);
  const patch = usePq((s) => s.patchPolicy);
  const commit = usePq((s) => s.commitPolicy);
  const q = INTERVIEW[Math.min(step, INTERVIEW.length - 1)];
  const done = step >= INTERVIEW.length;

  return (
    <div className="mx-auto grid max-w-2xl gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Skill interview · roles are groups</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Agree a policy before any kldload.</h1>
        <p className="mt-3 text-muted">
          Same discipline as freebsd-mac-lomac. Answers land in POLICY. Do not treat this browser
          as ruach. Reconfirm on the host.
        </p>
      </header>

      <div className="flex gap-1">
        {INTERVIEW.map((item, i) => (
          <button
            key={item.key}
            type="button"
            aria-label={item.title}
            onClick={() => setStep(i)}
            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-accent" : "bg-border")}
          />
        ))}
      </div>

      {done ? (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-medium">Agreed (workbench)</h2>
          <dl className="mt-4 grid gap-2 font-mono text-sm">
            <Row k="trusted" v={`${world.policy.trustedGroup} ∋ ${world.policy.trustedMembers.join(", ")}`} />
            <Row k="sandbox" v={`${world.policy.sandboxGroup} ∋ ${world.policy.sandboxMembers.join(", ")}`} />
            <Row k="root" v={world.policy.rootLabel} />
            <Row k="ledger" v={world.policy.ledgerDataset} />
            <Row k="A_D" v={world.policy.dacMode} />
            <Row k="hash" v={world.policy.hashName} />
            <Row k="boot" v={world.policy.bootSatisfied ? "attested · oneboot offered" : "not yet · beastie stays"} />
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={commit}>Rebuild host from POLICY</Button>
            <Button variant="ghost" asChild>
              <Link to="/host">Drive the host</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/export">Emit result</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {step + 1} / {INTERVIEW.length} · {q.title}
          </p>
          <p className="mt-3 text-lg text-fg">{q.ask}</p>
          <div className="mt-6">
            <Field q={q} policy={world.policy} patch={patch} />
          </div>
          <div className="mt-8 flex justify-between gap-3">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button onClick={() => setStep(step + 1)}>{step === INTERVIEW.length - 1 ? "Finish" : "Next"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="text-fg">{v}</dd>
    </div>
  );
}

function Field({
  q,
  policy,
  patch,
}: {
  q: (typeof INTERVIEW)[number];
  policy: Policy;
  patch: (p: Partial<Policy>) => void;
}) {
  if (q.kind === "bool") {
    const on = Boolean(policy[q.key]);
    return (
      <div className="flex gap-2">
        <Choice on={on} label="Yes" onClick={() => patch({ [q.key]: true } as Partial<Policy>)} />
        <Choice on={!on} label="No" onClick={() => patch({ [q.key]: false } as Partial<Policy>)} />
      </div>
    );
  }
  if (q.kind === "invert-bool") {
    const match = Boolean(policy[q.key]);
    return (
      <div className="flex flex-wrap gap-2">
        <Choice on={!match} label={q.yesLabel ?? "Yes"} onClick={() => patch({ [q.key]: false } as Partial<Policy>)} />
        <Choice on={match} label={q.noLabel ?? "No"} onClick={() => patch({ [q.key]: true } as Partial<Policy>)} />
      </div>
    );
  }
  if (q.kind === "csv") {
    const value = (policy[q.key] as string[]).join(", ");
    return (
      <input
        className="min-h-11 w-full rounded-md border border-border bg-bg px-3 text-fg"
        value={value}
        onChange={(e) =>
          patch({
            [q.key]: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          } as Partial<Policy>)
        }
      />
    );
  }
  if (q.kind === "text") {
    return (
      <input
        className="min-h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
        value={String(policy[q.key])}
        onChange={(e) => patch({ [q.key]: e.target.value } as Partial<Policy>)}
      />
    );
  }
  if (q.kind === "dac") {
    const mode = policy.dacMode;
    return (
      <div className="grid gap-2">
        {(["observe", "repair", "prevent"] as DacMode[]).map((m) => (
          <Choice
            key={m}
            on={mode === m}
            label={m}
            hint={
              m === "observe"
                ? "testdrift only"
                : m === "repair"
                  ? "chmod succeeds; repair restores"
                  : "ugidfw denies the grant; still repair existing drift"
            }
            onClick={() => patch({ dacMode: m })}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Choice on={policy.hashName === "SHA-256"} label="SHA-256 (workbench)" onClick={() => patch({ hashName: "SHA-256" })} />
      <Choice on={policy.hashName === "SHA-512"} label="SHA-512 (host)" onClick={() => patch({ hashName: "SHA-512" })} />
    </div>
  );
}

function Choice({
  on,
  label,
  hint,
  onClick,
}: {
  on: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-md border px-4 text-left text-sm",
        on ? "border-accent bg-surface-2 text-fg" : "border-border bg-bg text-muted",
      )}
    >
      <span className="font-medium">{label}</span>
      {hint ? <span className="ml-2 text-xs text-muted">{hint}</span> : null}
    </button>
  );
}
