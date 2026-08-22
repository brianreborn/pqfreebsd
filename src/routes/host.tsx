import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { childrenOf, resultColor } from "@/lib/pq/host";
import { integrityShow } from "@/lib/pq/labels";
import { formatMode } from "@/lib/pq/policy";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/host")({ component: Host });

export function Host() {
  const world = usePq((s) => s.world);
  const msg = usePq((s) => s.lastMessage);
  const demoted = usePq((s) => s.demoted);
  const dispatch = usePq((s) => s.dispatch);
  const reset = usePq((s) => s.reset);
  const [cwd, setCwd] = useState("/home/green");
  const [createName, setCreateName] = useState("scratch");
  const kids = childrenOf(world.nodes, cwd);
  const here = world.nodes[cwd];

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Simulated GENERIC · ruach-shaped</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">Drive the reference monitor.</h1>
          <p className="mt-2 max-w-prose text-muted">
            Login attaches integrity. Turn the lattice on only after files are labeled. A
            low-integrity process cannot overwrite high-integrity OS files. The owner can still
            chmod — then discretionary repair, if you asked for it.
          </p>
        </div>
        <Button variant="ghost" onClick={reset}>
          Reset world
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {Object.keys(world.subjects).map((name) => (
          <Button
            key={name}
            variant={world.actor === name ? "primary" : "ghost"}
            onClick={() => dispatch({ type: "login", name })}
          >
            login {name}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => dispatch({ type: "snapshot", when: "pre" })}>
          snapshot
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "label" })}>
          label
        </Button>
        <Button variant={world.enforce ? "danger" : "ghost"} onClick={() => dispatch({ type: world.enforce ? "unenforce" : "enforce" })}>
          {world.enforce ? "unenforce" : "enforce"}
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "establish" })}>
          establish
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "repair" })}>
          repair
        </Button>
      </div>

      <div
        className={cn(
          "rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm",
          demoted && "text-warn",
        )}
      >
        {msg}
      </div>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium text-muted">Worked attempts</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <Demo
            title="Low-integrity overwrite of OS"
            body="dev writes /usr/bin/pwn — the lattice should deny once on and labeled."
            onRun={() => {
              dispatch({ type: "label" });
              dispatch({ type: "enforce" });
              dispatch({ type: "login", name: "dev" });
              dispatch({ type: "write", path: "/usr/bin" });
            }}
          />
          <Demo
            title="Owner grant, then repair"
            body="green chmod 0777 notes. In repair mode the morphism restores 0644 and the ledger records it."
            onRun={() => {
              dispatch({ type: "login", name: "green" });
              dispatch({ type: "chmod", path: "/home/green/notes", mode: 0o777 });
            }}
          />
          <Demo
            title="Low-integrity scribble on the ledger"
            body="dev tries to write /pq/ledger/HEAD. High-integrity object, low-integrity process."
            onRun={() => {
              dispatch({ type: "label" });
              dispatch({ type: "enforce" });
              dispatch({ type: "login", name: "dev" });
              dispatch({ type: "write", path: "/pq/ledger/HEAD", content: "forged\n" });
            }}
          />
          <Demo
            title="Tamper evidence"
            body="root rewrites a ledger record without restating the hash. verify reports the break."
            onRun={() => {
              dispatch({ type: "login", name: "root" });
              dispatch({ type: "tamper", seq: 0 });
              dispatch({ type: "verify" });
            }}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-muted">{cwd}</p>
            <Button variant="quiet" onClick={() => setCwd(cwd === "/" ? "/" : cwd.split("/").slice(0, -1).join("/") || "/")}>
              parent
            </Button>
          </div>
          {here ? (
            <p className="mt-2 text-xs text-muted">
              {here.kind} {here.owner}:{here.group} {formatMode(here.mode)} {integrityShow(here.label)}
              <span className="ml-2 font-mono">{here.label}</span>
            </p>
          ) : null}
          <ul className="mt-4 grid gap-1">
            {kids.map((n) => (
              <li key={n.path} className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-surface-2">
                <button type="button" className="min-h-11 text-left font-mono text-sm" onClick={() => (n.kind === "dir" ? setCwd(n.path) : dispatch({ type: "read", path: n.path }))}>
                  {n.path === "/" ? "/" : n.path.slice(cwd === "/" ? 1 : cwd.length + 1)}
                  <span className="ml-2 text-xs text-muted">
                    {formatMode(n.mode)} {integrityShow(n.label)}
                  </span>
                </button>
                <span className="flex flex-wrap gap-1">
                  <Mini onClick={() => dispatch({ type: "read", path: n.path })}>read</Mini>
                  <Mini onClick={() => dispatch({ type: "write", path: n.path })}>write</Mini>
                  <Mini onClick={() => dispatch({ type: "chmod", path: n.path, mode: 0o777 })}>chmod 777</Mini>
                </span>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const path = `${cwd === "/" ? "" : cwd}/${createName}`;
              dispatch({ type: "create", path, kind: "file" });
            }}
          >
            <input
              className="min-h-11 flex-1 rounded-md border border-border bg-bg px-3 font-mono text-sm"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              aria-label="new file name"
            />
            <Button type="submit" variant="ghost">
              create
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-bg p-4">
          <h2 className="text-sm font-medium text-muted">Ledger tail</h2>
          <ol className="mt-3 grid max-h-[28rem] gap-2 overflow-auto font-mono text-xs">
            {[...world.ledger].slice(-14).reverse().map((e) => (
              <li key={e.seq} className="rounded-md border border-border bg-surface px-3 py-2">
                <span className="text-subtle">{String(e.seq).padStart(3, "0")}</span>{" "}
                <span className={resultColor(e.result)}>{e.result}</span> {e.op} {e.object}
                <div className="mt-1 text-muted">{e.detail}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function Mini({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-11 rounded-sm px-2 text-xs text-muted hover:text-fg">
      {children}
    </button>
  );
}

function Demo({ title, body, onRun }: { title: string; body: string; onRun: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <Button className="mt-3" variant="ghost" onClick={onRun}>
        Run
      </Button>
    </div>
  );
}
