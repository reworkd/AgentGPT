import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type AutonomousAgent from "../services/agent/autonomous-agent";
import type { ActiveTool } from "../hooks/useTools";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  isAgentThinking: false,
  isAgentStopped: true,
  isAgentPaused: undefined,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  isAgentThinking: boolean;
  setIsAgentThinking: (isThinking: boolean) => void;
  isAgentStopped: boolean;
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
    setIsAgentThinking: (isThinking: boolean) => {
      set(() => ({
        isAgentThinking: isThinking,
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
        name: "agent-storage-v2",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          tools: state.tools,
        }),
      }
    )
  )
);
