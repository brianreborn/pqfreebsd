import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "quiet";
  asChild?: boolean;
};

export function Button({ className, variant = "primary", asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-[opacity,transform] duration-150 ease-out disabled:opacity-40",
        "active:scale-95",
        variant === "primary" && "bg-accent text-accent-fg hover:opacity-90",
        variant === "ghost" && "border border-border bg-surface text-fg hover:bg-surface-2",
        variant === "danger" && "bg-deny text-fg hover:opacity-90",
        variant === "quiet" && "text-muted hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}
