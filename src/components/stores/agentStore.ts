import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type AutonomousAgent from "../AutonomousAgent";
import { AGENT_PAUSE, AUTOMATIC_MODE } from "../../types/agentTypes";
import type { AgentPlaybackControl, AgentMode } from "../../types/agentTypes";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  isAgentStopped: true,
  isWebSearchEnabled: false,
  isAgentPaused: undefined,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  isAgentStopped: boolean;
  isAgentPaused: boolean | undefined;
  agentMode: AgentMode;
  updateAgentMode: (agentMode: AgentMode) => void;
  updateIsAgentPaused: (agentPlaybackControl: AgentPlaybackControl) => void;
  updateIsAgentStopped: () => void;
  isWebSearchEnabled: boolean;
  setIsWebSearchEnabled: (isWebSearchEnabled: boolean) => void;
  setAgent: (newAgent: AutonomousAgent | null) => void;
}

const createAgentSlice: StateCreator<AgentSlice> = (set, get) => {
  resetters.push(() => set(initialAgentState));
  return {
    ...initialAgentState,
    agentMode: AUTOMATIC_MODE,
    updateAgentMode: (agentMode) => {
      set(() => ({
        agentMode,
      }));
    },
    updateIsAgentPaused: (agentPlaybackControl) => {
      set(() => ({
        isAgentPaused: agentPlaybackControl === AGENT_PAUSE,
      }));
    },
    updateIsAgentStopped: () => {
      set((state) => ({
        isAgentStopped: !state.agent?.isRunning,
      }));
    },
    isWebSearchEnabled: false,
    setIsWebSearchEnabled: (isWebSearchEnabled) => {
      set(() => ({
        isWebSearchEnabled,
      }));
    },
    setAgent: (newAgent) => {
      set(() => ({
        agent: newAgent,
      }));

      if (get().agent === null) {
        resetAllAgentSlices();
      }
    },
  };
};

const agentStore = create<AgentSlice>()(
  persist(
    (...a) => ({
      ...createAgentSlice(...a),
    }),
    {
      name: "agent-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        agentMode: state.agentMode,
        // isWebSearchEnabled: state.isWebSearchEnabled
      }),
    }
  )
);

export const useAgentStore = createSelectors(agentStore);

export const resetAllAgentSlices = () =>
  resetters.forEach((resetter) => resetter());
