import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findDrift } from "./dac";
import { createWorld, reduce, type Action } from "./host";
import { DEFAULT_POLICY } from "./policy";
import type { Policy, World } from "./types";

type PqStore = {
  world: World;
  lastMessage: string;
  demoted: boolean;
  interviewStep: number;
  dispatch: (action: Action) => void;
  setInterviewStep: (n: number) => void;
  patchPolicy: (patch: Partial<Policy>) => void;
  commitPolicy: () => void;
  reset: () => void;
};

export const usePq = create<PqStore>()(
  persist(
    (set, get) => ({
      world: createWorld(DEFAULT_POLICY),
      lastMessage: "genesis written; A_M staged, enabled=0",
      demoted: false,
      interviewStep: 0,
      dispatch: (action) => {
        const step = reduce(get().world, action);
        set({ world: step.world, lastMessage: step.message, demoted: step.demoted });
      },
      setInterviewStep: (n) => set({ interviewStep: n }),
      patchPolicy: (patch) => {
        const policy = { ...get().world.policy, ...patch };
        const step = reduce(get().world, { type: "setPolicy", policy });
        set({ world: step.world, lastMessage: step.message });
      },
      commitPolicy: () => {
        const step = reduce(get().world, { type: "reset", policy: get().world.policy });
        set({
          world: step.world,
          lastMessage: "interview committed; world rebuilt from POLICY",
          demoted: false,
        });
      },
      reset: () =>
        set({
          world: createWorld(DEFAULT_POLICY),
          lastMessage: "reset to ruach-shaped defaults",
          demoted: false,
          interviewStep: 0,
        }),
    }),
    { name: "pqfreebsd-studio" },
  ),
);

export function useDrift() {
  return findDrift(usePq.getState().world.nodes, usePq.getState().world.rules);
}
