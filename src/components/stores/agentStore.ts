import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type AutonomousAgent from "../AutonomousAgent";
import { AGENT_PAUSE } from "../../types/agentTypes";
import type { AgentPlaybackControl } from "../../types/agentTypes";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  isAgentStopped: true,
  isAgentPaused: undefined,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  isAgentStopped: boolean;
  isAgentPaused: boolean | undefined;
  setIsAgentStopped: () => void;
  updateIsAgentPaused: (agentPlaybackControl: AgentPlaybackControl) => void;
  setAgent: (newAgent: AutonomousAgent | null) => void;
}

const createAgentSlice: StateCreator<AgentSlice> = (set, get) => {
  resetters.push(() => set(initialAgentState));
  return {
    ...initialAgentState,
    updateIsAgentPaused: (agentPlaybackControl: AgentPlaybackControl) => {
      set(() => ({
        isAgentPaused: agentPlaybackControl === AGENT_PAUSE,
      }));
    },
    setIsAgentStopped: () => {
      set((state) => ({
        isAgentStopped: !state.agent?.isRunning,
      }));
    },
    setAgent: (newAgent) => {
      console.log(newAgent);
      set(() => ({
        agent: newAgent,
      }));

      if (get().agent === null) {
        resetAllAgentSlices();
      }
    },
  };
};

export const useAgentStore = createSelectors(
  create<AgentSlice>()((...a) => ({
    ...createAgentSlice(...a),
  }))
);

export const resetAllAgentSlices = () =>
  resetters.forEach((resetter) => resetter());
