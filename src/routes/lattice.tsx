import { createFileRoute } from "@tanstack/react-router";
import { gradeOf } from "@/lib/pq/host";
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
        <p className="text-xs uppercase tracking-[0.18em] text-muted">mac_lomac(4) · Biba-like integrity</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">A short proof, few labels.</h1>
        <p className="mt-3 text-muted">
          Read-down demotes. Write-up fails. equal is exemption, not containment. This is not
          Bell-LaPadula secrecy and not Goguen–Meseguer non-interference with respect to the plant.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <svg viewBox="0 0 640 420" className="w-full rounded-xl border border-border bg-surface">
          <text x="40" y="48" fill="currentColor" className="text-fg" fontSize="13">
            high
          </text>
          <text x="40" y="210" fill="currentColor" className="text-muted" fontSize="13">
            10
          </text>
          <text x="40" y="372" fill="currentColor" className="text-muted" fontSize="13">
            low
          </text>
          <line x1="90" y1="52" x2="90" y2="360" stroke="currentColor" className="text-border" />
          <circle cx="90" cy="44" r="6" className="text-high" fill="currentColor" />
          <circle cx="90" cy="206" r="6" className="text-accent" fill="currentColor" />
          <circle cx="90" cy="368" r="6" className="text-low" fill="currentColor" />
          {subjects.map((s, i) => {
            const y = yOf(s.effective);
            return (
              <g key={s.name}>
                <circle cx={180 + i * 130} cy={y} r="10" className="text-accent" fill="currentColor" />
                <text x={180 + i * 130} y={y - 18} textAnchor="middle" fill="currentColor" fontSize="12">
                  {s.name}
                </text>
                <text
                  x={180 + i * 130}
                  y={y + 28}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-muted"
                  fontSize="10"
                >
                  {s.role}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-medium">Subjects</h2>
          <ul className="mt-4 grid gap-3 font-mono text-sm">
            {subjects.map((s) => (
              <li key={s.name} className="flex justify-between gap-3">
                <span>
                  {s.name}{" "}
                  <span className="text-muted">
                    uid {s.uid} · {s.label}
                  </span>
                </span>
                <span className={cn(s.effective === "equal" ? "text-accent" : "text-fg")}>
                  {String(s.effective)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Labels attach at login. Demotion is in-process. A new login restores the class grade.
            mmap revocation may drop mappings when a subject falls.
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-medium">Objects in L</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">path</th>
                <th className="px-4 py-3 font-medium">label</th>
                <th className="px-4 py-3 font-medium">grade</th>
                <th className="px-4 py-3 font-medium">owner</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((n) => (
                <tr key={n.path} className="border-t border-border">
                  <td className="px-4 py-2 font-mono">{n.path}</td>
                  <td className="px-4 py-2 text-muted">{n.label}</td>
                  <td className="px-4 py-2">{String(gradeOf(n.label))}</td>
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
  if (g <= 0) return 368;
  return 206;
}
