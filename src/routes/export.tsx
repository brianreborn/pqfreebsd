import { createFileRoute } from "@tanstack/react-router";
import { downloadText, emitResult } from "@/lib/pq/export";
import { usePq } from "@/lib/pq/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/export")({ component: Export });

function Export() {
  const world = usePq((s) => s.world);
  const files = emitResult(world);

  return (
    <div className="grid gap-6">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Result directory · not the host</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Emit. Then oneinstall on FreeBSD.</h1>
        <p className="mt-3 text-muted">
          The workbench is the interview. The skill writes the same files plus rc.d packages. Pin
          freebsd-mac-grok; do not kldload until a test window. Light-ware License; this product
          includes software developed by Brian Fundakowski Feldman.
        </p>
      </header>

      <ol className="grid gap-2 rounded-xl border border-border bg-surface p-5 font-mono text-sm text-muted">
        <li>sudo ./pqfreebsd oneinstall</li>
        <li>sudo service pqfreebsd onesnapshot</li>
        <li>sudo service pqfreebsd onestage</li>
        <li>sudo service pqfreebsd onesnapshot_after</li>
        <li>sudo service pqledger onestage && service pqdac oneestablish</li>
        <li>sudo service mac_lomac_grok onelabel && onechecklabels</li>
        <li>sudo service pqfreebsd oneenforce</li>
      </ol>

      <div className="grid gap-4">
        {files.map((f) => (
          <article key={f.path} className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-mono text-sm">{f.path}</h2>
              <Button variant="ghost" onClick={() => downloadText(f.path, f.body)}>
                Download
              </Button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-muted">{f.body}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}
