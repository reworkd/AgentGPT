import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type AutonomousAgent from "../AutonomousAgent";

const initialAgentState = {
  agent: null,
  isAgentStopped: true,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  isAgentStopped: boolean;
  updateIsAgentStopped: () => void;
  setAgent: (newAgent: AutonomousAgent | null) => void;
}

const createAgentSlice: StateCreator<AgentSlice> = (set, get) => {
  return {
    ...initialAgentState,
    updateIsAgentStopped: () => {
      set((state) => ({
        isAgentStopped: !state.agent?.isRunning,
      }));
    },
    setAgent: (newAgent) => {
      set(() => ({
        agent: newAgent,
      }));
    },
  };
};

export const useAgentStore = createSelectors(
  create<AgentSlice>()((...a) => ({
    ...createAgentSlice(...a),
  }))
);
