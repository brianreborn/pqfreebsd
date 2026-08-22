import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { audit } from "@/lib/pq/audit";
import { claimTally, evaluateClaims } from "@/lib/pq/claims";
import { findDrift } from "@/lib/pq/dac";
import { headHash } from "@/lib/pq/host";
import { usePq } from "@/lib/pq/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Graph" },
  { to: "/paper", label: "Paper" },
  { to: "/interview", label: "Interview" },
  { to: "/lattice", label: "Lattice" },
  { to: "/host", label: "Host" },
  { to: "/ledger", label: "Ledger" },
  { to: "/dac", label: "A_D" },
  { to: "/audit", label: "Audit" },
  { to: "/claims", label: "Claims" },
  { to: "/confirm", label: "Held" },
  { to: "/code", label: "Code" },
  { to: "/bounds", label: "Bounds" },
  { to: "/boot", label: "Boot" },
  { to: "/issues", label: "Issues" },
  { to: "/export", label: "Emit" },
] as const;

export function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const world = usePq((s) => s.world);
  const drift = findDrift(world.nodes, world.rules).length;
  const hash = headHash(world);
  const report = audit(world);
  const tally = claimTally(evaluateClaims(world));

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-h-11 items-center gap-3">
            <img src="/favicon.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span>
              <span className="block font-medium tracking-tight">pqfreebsd</span>
              <span className="block text-xs text-muted">post-quantum trusted FreeBSD</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-muted">
            <Chip label={world.actor} />
            <Chip label={world.enforce ? "enforce" : "staged"} tone={world.enforce ? "warn" : "ok"} />
            <Chip label={world.chainOk ? `ie ${hash}` : "chain BROKEN"} tone={world.chainOk ? "ok" : "deny"} />
            <Chip label={drift ? `drift ${drift}` : "A_D clean"} tone={drift ? "warn" : "ok"} />
            <Chip
              label={tally.broken ? "claims broken" : tally.degraded ? `degraded ${tally.degraded}` : `holds ${tally.holds}`}
              tone={tally.broken ? "deny" : tally.degraded ? "warn" : "ok"}
            />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center rounded-md px-3 text-sm transition-colors duration-150",
                  active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function Chip({ label, tone }: { label: string; tone?: "ok" | "warn" | "deny" }) {
  return (
    <span
      className={cn(
        "rounded-sm border border-border bg-surface-2 px-2 py-1",
        tone === "ok" && "text-ok",
        tone === "warn" && "text-warn",
        tone === "deny" && "text-deny",
      )}
    >
      {label}
    </span>
  );
}
