import { createFileRoute } from "@tanstack/react-router";
import { INTEGRITY_GLOSS, integrityPlainGrade, integrityShow } from "@/lib/pq/labels";
import { usePq } from "@/lib/pq/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lattice")({ component: Lattice });

function Lattice() {
  const world = usePq((s) => s.world);
  const subjects = Object.values(world.subjects);
  const objects = Object.values(world.nodes);

  return (
    <div className="grid gap-8">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">mac_lomac(4) · integrity lattice</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">High-integrity and low-integrity. A short proof.</h1>
        <p className="mt-3 text-muted">
          Reading a low-integrity file drops you to low-integrity. You then cannot overwrite
          high-integrity OS files. Exempt is outside the lattice — not a third grade of
          containment. This is integrity, not secrecy.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <svg viewBox="0 0 640 420" className="w-full rounded-xl border border-border bg-surface">
          <text x="40" y="48" fill="currentColor" className="text-fg" fontSize="13">
            high-integrity
          </text>
          <text x="40" y="372" fill="currentColor" className="text-muted" fontSize="13">
            low-integrity
          </text>
          <line x1="118" y1="52" x2="118" y2="360" stroke="currentColor" className="text-border" />
          <circle cx="118" cy="44" r="6" className="text-high" fill="currentColor" />
          <circle cx="118" cy="368" r="6" className="text-low" fill="currentColor" />
          {subjects.map((s, i) => {
            const y = yOf(s.effective);
            return (
              <g key={s.name}>
                <circle cx={220 + i * 130} cy={y} r="10" className="text-accent" fill="currentColor" />
                <text x={220 + i * 130} y={y - 18} textAnchor="middle" fill="currentColor" fontSize="12">
                  {s.name}
                </text>
                <text
                  x={220 + i * 130}
                  y={y + 28}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-muted"
                  fontSize="10"
                >
                  {integrityPlainGrade(s.effective)}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-medium">Who is at which integrity</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {subjects.map((s) => (
              <li key={s.name} className="flex justify-between gap-3">
                <span>
                  {s.name}{" "}
                  <span className="font-mono text-muted">
                    uid {s.uid}
                  </span>
                </span>
                <span className={cn(s.effective === "equal" ? "text-accent" : "text-fg")}>
                  {integrityPlainGrade(s.effective)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-2 text-sm text-muted">
            <div>
              <dt className="font-medium text-fg">high-integrity</dt>
              <dd>{INTEGRITY_GLOSS["high-integrity"]}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">low-integrity</dt>
              <dd>{INTEGRITY_GLOSS["low-integrity"]}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">exempt</dt>
              <dd>{INTEGRITY_GLOSS.exempt}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted">
            Integrity attaches at login. A new login restores the class. The kernel still
            writes lomac/high and lomac/low; we just refuse to say only “high.”
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-medium">Objects</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">path</th>
                <th className="px-4 py-3 font-medium">integrity</th>
                <th className="px-4 py-3 font-medium">kernel</th>
                <th className="px-4 py-3 font-medium">owner</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((n) => (
                <tr key={n.path} className="border-t border-border">
                  <td className="px-4 py-2 font-mono">{n.path}</td>
                  <td className="px-4 py-2">{integrityShow(n.label)}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted">{n.label}</td>
                  <td className="px-4 py-2">
                    {n.owner}:{n.group}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function yOf(g: number | "equal") {
  if (g === "equal") return 120;
  if (g >= 100) return 44;
  return 368;
}
