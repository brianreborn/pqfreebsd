import type { DacRule, Drift, FsNode } from "./types";
import { formatMode } from "./policy";

export function matchRule(rules: DacRule[], path: string): DacRule | null {
  for (const rule of rules) {
    if (new RegExp(rule.pattern).test(path)) return rule;
  }
  return null;
}

export function intendedMode(rule: DacRule, kind: FsNode["kind"]) {
  return kind === "dir" ? rule.dirMode : rule.fileMode;
}

export function findDrift(nodes: Record<string, FsNode>, rules: DacRule[]): Drift[] {
  const out: Drift[] = [];
  for (const node of Object.values(nodes)) {
    const rule = matchRule(rules, node.path);
    if (!rule) continue;
    const mode = intendedMode(rule, node.kind);
    if (node.owner !== rule.owner) {
      out.push({ path: node.path, field: "owner", intended: rule.owner, actual: node.owner, ruleId: rule.id });
    }
    if (node.group !== rule.group) {
      out.push({ path: node.path, field: "group", intended: rule.group, actual: node.group, ruleId: rule.id });
    }
    if (node.mode !== mode) {
      out.push({
        path: node.path,
        field: "mode",
        intended: formatMode(mode),
        actual: formatMode(node.mode),
        ruleId: rule.id,
      });
    }
  }
  return out;
}

export function applyRule(node: FsNode, rule: DacRule): FsNode {
  return {
    ...node,
    owner: rule.owner,
    group: rule.group,
    mode: intendedMode(rule, node.kind),
  };
}

export function wouldDrift(node: FsNode, rule: DacRule, next: Partial<Pick<FsNode, "owner" | "group" | "mode">>) {
  const owner = next.owner ?? node.owner;
  const group = next.group ?? node.group;
  const mode = next.mode ?? node.mode;
  return owner !== rule.owner || group !== rule.group || mode !== intendedMode(rule, node.kind);
}
