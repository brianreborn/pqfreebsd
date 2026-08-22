import { useEffect, useState } from "react";
import { COL, FRAME_COUNT, LOGO_H, LOGO_W, SETTLE_FRAME, makeFrame } from "@/lib/pq/shield-anim";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLOR: Record<number, string> = {
  [COL.dim]: "text-[#4a524c]",
  [COL.steel]: "text-[#c5c9c2]",
  [COL.hilt]: "text-[#8aa39a]",
  [COL.sage]: "text-[#8b9a86]",
  [COL.gleam]: "text-[#f4f1ea]",
};

export function ShieldBoot({ auto = true }: { auto?: boolean }) {
  const [step, setStep] = useState(0);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!auto || reduced) {
      setStep(SETTLE_FRAME);
      return;
    }
    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= FRAME_COUNT - 1) {
          window.clearInterval(id);
          return SETTLE_FRAME;
        }
        return s + 1;
      });
    }, 70);
    return () => window.clearInterval(id);
  }, [auto, gen]);

  const frame = makeFrame(step);

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-[#0c0d0c]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          loader.efi · logo-pqfreebsd.4th · ASCII + ANSI
        </p>
        <Button variant="quiet" onClick={() => setGen((g) => g + 1)}>
          Replay
        </Button>
      </div>
      <pre
        aria-label="pqfreebsd boot logo animation, shield over a sword"
        className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.15] tracking-[0.04em] md:text-[15px]"
      >
        {frame.map((row, y) => (
          <span key={y} className="block whitespace-pre">
            {row.map((cell, x) => (
              <span key={`${y}-${x}`} className={cn(COLOR[cell.c], cell.c === COL.gleam && "brightness-125")}>
                {cell.ch}
              </span>
            ))}
          </span>
        ))}
      </pre>
      <figcaption className="px-4 py-3 text-xs text-muted">
        {LOGO_W}×{LOGO_H} Forth logo. Sword, then shield, then a gleam. Color is SGR. Serial consoles
        still get the ASCII. TPM not this pass.
      </figcaption>
    </figure>
  );
}
