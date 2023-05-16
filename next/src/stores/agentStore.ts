import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type AutonomousAgent from "../components/AutonomousAgent";
import type { AgentMode, AgentPlaybackControl, AgentStatus } from "../types/agentTypes";
import { AGENT_PAUSE, AUTOMATIC_MODE } from "../types/agentTypes";
import { env } from "../env/client.mjs";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  agentStatus: "stopped" as AgentStatus,
  isAgentStopped: true,
  isAgentPaused: undefined,
};

type Consumer<T> = (obj: T) => void;

interface AgentSlice {
  agent: AutonomousAgent | null;
  agentStatus: AgentStatus;
  isAgentStopped: boolean;
  isAgentPaused: boolean | undefined;
  agentMode: AgentMode;
  updateAgentStatus: Consumer<AgentStatus>;
  updateAgentMode: Consumer<AgentMode>;
  isWebSearchEnabled: boolean;
  setIsWebSearchEnabled: Consumer<boolean>;
  setAgent: Consumer<AutonomousAgent | null>;
}

const createAgentSlice: StateCreator<AgentSlice> = (set, get) => {
  resetters.push(() => set(initialAgentState));
  return {
    ...initialAgentState,
    isWebSearchEnabled: env.NEXT_PUBLIC_WEB_SEARCH_ENABLED,
    agentMode: AUTOMATIC_MODE,
    updateAgentStatus: (agentStatus) => {
      set(() => ({
        agentStatus,
      }));
    },

    updateAgentMode: (agentMode) => {
      set(() => ({
        agentMode,
      }));
    },
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

export const resetAllAgentSlices = () => resetters.forEach((resetter) => resetter());
