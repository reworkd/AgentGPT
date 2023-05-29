import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type AutonomousAgent from "../services/agent/autonomous-agent";
import type { AgentMode, AgentPlaybackControl } from "../types/agentTypes";
import { AGENT_PAUSE, AUTOMATIC_MODE } from "../types/agentTypes";
import type { ActiveTool } from "../hooks/useTools";

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
  agentMode: AgentMode;
  updateAgentMode: (agentMode: AgentMode) => void;
  updateIsAgentPaused: (agentPlaybackControl: AgentPlaybackControl) => void;
  updateIsAgentStopped: () => void;
  setAgent: (newAgent: AutonomousAgent | null) => void;
}

interface ToolsSlice {
  tools: Omit<ActiveTool, "active">[];
  setTools: (tools: ActiveTool[]) => void;
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
    setAgent: (newAgent) => {
      set(() => ({
        agent: newAgent,
      }));

      if (get().agent === null) {
        resetters.forEach((resetter) => resetter());
      }
    },
  };
};

const createToolsSlice: StateCreator<ToolsSlice> = (set) => {
  return {
    tools: [],
    setTools: (tools) => {
      set(() => ({
        tools: tools,
      }));
    },
  };
};

export const useAgentStore = createSelectors(
  create<AgentSlice & ToolsSlice>()(
    persist(
      (...a) => ({
        ...createAgentSlice(...a),
        ...createToolsSlice(...a),
      }),
      {
        name: "agent-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          agentMode: state.agentMode,
        }),
      }
    )
  )
);
