import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type AutonomousAgent from "../components/AutonomousAgent";
import type { AgentMode, AgentStatus } from "../types/agentTypes";
import { AUTOMATIC_MODE } from "../types/agentTypes";
import { env } from "../env/client.mjs";
import { Consumer } from "../types";
import { invoke } from "lodash";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  agentStatus: "stopped" as AgentStatus,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  setAgent: Consumer<AutonomousAgent | null>;
  agentStatus: AgentStatus;
  updateAgentStatus: Consumer<AgentStatus>;
  agentMode: AgentMode;
  updateAgentMode: Consumer<AgentMode>;
  isWebSearchEnabled: boolean;
  setIsWebSearchEnabled: Consumer<boolean>;
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
        resetters.forEach(invoke);
      }
    },
  };
};

export const useAgentStore = createSelectors(
  create<AgentSlice>()(
    persist(
      (...a) => ({
        ...createAgentSlice(...a),
      }),
      {
        name: "agent-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          agentMode: state.agentMode,
          // isWebSearchEnabled: state.isWebSearchEnabled,
        }),
      }
    )
  )
);
