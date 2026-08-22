/**
 * Operator-facing integrity names. Kernel strings stay lomac/high, lomac/low,
 * lomac/10[2], lomac/equal — we do not rename the module. We refuse to say
 * "high" and "low" as if they were unexplained jargon.
 */
export type IntegrityPlain = "high-integrity" | "low-integrity" | "exempt";

export function integrityPlain(label: string): IntegrityPlain {
  const s = label.toLowerCase();
  if (s.includes("equal")) return "exempt";
  if (s.includes("high")) return "high-integrity";
  return "low-integrity";
}

export function integrityPlainGrade(g: number | "equal"): IntegrityPlain {
  if (g === "equal") return "exempt";
  if (typeof g === "number" && g >= 100) return "high-integrity";
  return "low-integrity";
}

export function integrityKernel(plain: IntegrityPlain): string {
  if (plain === "high-integrity") return "lomac/high";
  if (plain === "exempt") return "lomac/equal";
  return "lomac/low";
}

export function integrityShow(label: string): string {
  return integrityPlain(label);
}

export const INTEGRITY_GLOSS: Record<IntegrityPlain, string> = {
  "high-integrity": "OS and other files a lowered process must not overwrite",
  "low-integrity": "user files, agents, and the level you drop to after reading them",
  exempt: "outside the lattice — exemption, not containment",
};

export const ROLE_GLOSS = {
  trusted: "high-integrity role — humans who may start able to write OS files",
  sandbox: "low-integrity role — agents, builders, guests; new users default here",
} as const;
