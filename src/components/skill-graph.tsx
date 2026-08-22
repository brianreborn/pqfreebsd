import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CREATION_ORDER, HELD_ORDER, SKILL_EDGES, SKILL_NODES, type SkillNode } from "@/lib/pq/graph";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const W = 196;
const H = 56;
const CX = W / 2;

function usePrefers() {
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const width = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setReduced(motion.matches);
      setNarrow(width.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    width.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      width.removeEventListener("change", sync);
    };
  }, []);
  return { reduced, narrow };
}

export function SkillGraph() {
  const navigate = useNavigate();
  const { reduced, narrow } = usePrefers();
  const bootOn = usePq((s) => s.world.policy.bootSatisfied);
  const [gen, setGen] = useState(0);
  const [born, setBorn] = useState<Set<string>>(() => new Set());
  const [log, setLog] = useState<SkillNode[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) {
      setBorn(new Set(CREATION_ORDER.map((n) => n.id)));
      setLog(CREATION_ORDER);
      return;
    }
    setBorn(new Set());
    setLog([]);
    const timers: number[] = [];
    for (const node of CREATION_ORDER) {
      timers.push(
        window.setTimeout(() => {
          setBorn((prev) => new Set(prev).add(node.id));
          setLog((prev) => [...prev, node]);
        }, node.delay),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [gen, reduced]);

  const byId = useMemo(() => Object.fromEntries(SKILL_NODES.map((n) => [n.id, n])), []);
  const gatedBorn = (n: SkillNode) => {
    if (n.id === "pqboot") return bootOn;
    if (n.kind === "pending") return false;
    return born.has(n.id);
  };
  const filled = CREATION_ORDER.filter((n) => born.has(n.id)).length + (bootOn ? 1 : 0);
  const heldLeft = HELD_ORDER.filter((n) => n.id !== "pqboot" || !bootOn).length;

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            skill graph · filling as created
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">
            Derivation, not a stack of slogans.
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm tabular-nums text-muted">
            {filled} / {CREATION_ORDER.length + 1} created
            <span className="text-subtle"> · {heldLeft} held</span>
          </p>
          <Button variant="ghost" onClick={() => setGen((g) => g + 1)}>
            Replay creation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)]">
        {narrow ? (
          <ol className="grid gap-2 rounded-xl border border-border bg-surface p-3">
            {SKILL_NODES.map((n) => {
              const isBorn = gatedBorn(n);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(n.id);
                      navigate({ to: n.href });
                    }}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-3 rounded-md border px-3 py-3 text-left transition-[opacity,border-color] duration-500",
                      isBorn
                        ? "border-border bg-surface-2 text-fg"
                        : "border-dashed border-border text-muted",
                      selected === n.id && "border-accent",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">{n.label}</span>
                      <span className="block text-xs text-muted">
                        {isBorn ? n.subtitle : n.kind === "pending" ? "held · not this pass" : n.subtitle}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-subtle">
                      {isBorn ? "created" : n.kind === "pending" ? "held" : "…"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <svg viewBox="0 0 960 740" role="img" aria-label="Skill derivation graph" className="h-auto w-full text-fg">
              <title>pqfreebsd skill derivation</title>
              {SKILL_EDGES.map((e) => {
                const a = byId[e.from];
                const b = byId[e.to];
                const pendingLook = b.kind === "pending" && !gatedBorn(b);
                const live = gatedBorn(a) && (gatedBorn(b) || pendingLook);
                return (
                  <line
                    key={`${e.from}-${e.to}`}
                    x1={a.x + CX}
                    y1={a.y + H}
                    x2={b.x + CX}
                    y2={b.y}
                    className={cn(pendingLook ? "text-subtle" : "text-border", live ? "opacity-100" : "opacity-25")}
                    stroke="currentColor"
                    strokeWidth={pendingLook ? 1.25 : 1.5}
                    strokeDasharray={pendingLook ? "5 5" : undefined}
                  />
                );
              })}
              {SKILL_NODES.map((n) => {
                const isBorn = gatedBorn(n);
                const isSel = selected === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x} ${n.y})`}
                    className={cn(
                      "cursor-pointer transition-opacity duration-500 ease-out",
                      isBorn || (n.kind === "pending" && !isBorn) ? "opacity-100" : "opacity-25",
                    )}
                    onClick={() => {
                      setSelected(n.id);
                      navigate({ to: n.href });
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        setSelected(n.id);
                        navigate({ to: n.href });
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`${n.label}: ${n.subtitle}${n.kind === "pending" ? " (not this pass)" : ""}`}
                  >
                    <rect
                      width={W}
                      height={H}
                      rx={10}
                      className={cn(
                        n.kind === "here" && isBorn ? "fill-accent/15" : "fill-surface",
                        n.kind === "pending" ? "text-subtle" : isBorn ? "text-accent" : "text-border",
                      )}
                      stroke="currentColor"
                      strokeWidth={isSel ? 2 : 1.25}
                      strokeDasharray={n.kind === "pending" && !isBorn ? "4 3" : !isBorn ? "4 3" : undefined}
                    />
                    <text
                      x={CX}
                      y={24}
                      textAnchor="middle"
                      fill="currentColor"
                      className={n.kind === "pending" ? "text-muted" : "text-fg"}
                      fontSize="13"
                      fontFamily="IBM Plex Sans, sans-serif"
                    >
                      {n.label}
                    </text>
                    <text
                      x={CX}
                      y={42}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-muted"
                      fontSize="10"
                      fontFamily="IBM Plex Sans, sans-serif"
                    >
                      {n.kind === "pending" && !isBorn ? "held · not this pass" : n.subtitle}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        <aside className="flex min-h-64 flex-col rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">creation log</p>
          <ol className="mt-3 flex-1 space-y-2 overflow-auto font-mono text-xs">
            {log.length === 0 ? (
              <li className="text-subtle">waiting to create…</li>
            ) : (
              log.map((n, i) => (
                <li key={n.id} className="text-muted">
                  <span className="text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>{" "}
                  <span className="text-ok">created</span> {n.label}
                </li>
              ))
            )}
            {bootOn ? (
              <li className="text-ok">created pqboot — splash attested, TPM not this pass</li>
            ) : null}
            {filled >= CREATION_ORDER.length ? (
              <li className="text-warn">
                held {HELD_ORDER.filter((n) => n.id !== "pqboot" || !bootOn).map((n) => n.label).join(", ")}
              </li>
            ) : null}
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Payload confirmation, ZFS send authentication, code signatures, and SEBSD are
            required of the system and are deliberately not skills until you say so.
          </p>
        </aside>
      </div>
    </section>
  );
}
