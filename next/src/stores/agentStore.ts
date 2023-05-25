import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type AutonomousAgent from "../components/AutonomousAgent";
import type { AgentMode, AgentPlaybackControl } from "../types/agentTypes";
import { AGENT_PAUSE, AUTOMATIC_MODE } from "../types/agentTypes";
import { env } from "../env/client.mjs";
import type { Tool } from "../server/api/routers/toolsRouter";

const resetters: (() => void)[] = [];

const initialAgentState = {
  agent: null,
  tools: [],
  isAgentStopped: true,
  isAgentPaused: undefined,
};

interface AgentSlice {
  agent: AutonomousAgent | null;
  tools: Tool[];
  isAgentStopped: boolean;
  isAgentPaused: boolean | undefined;
  isWebSearchEnabled: boolean;
  agentMode: AgentMode;
  updateAgentMode: (agentMode: AgentMode) => void;
  setTools: (tools: Tool[]) => void;
  updateToolActiveState: (toolName: string) => void;
  updateIsAgentPaused: (agentPlaybackControl: AgentPlaybackControl) => void;
  updateIsAgentStopped: () => void;
  setIsWebSearchEnabled: (isWebSearchEnabled: boolean) => void;
  setAgent: (newAgent: AutonomousAgent | null) => void;
}

const createAgentSlice: StateCreator<AgentSlice> = (set, get) => {
  resetters.push(() => set(initialAgentState));
  return {
    ...initialAgentState,
    agentMode: AUTOMATIC_MODE,
    isWebSearchEnabled: env.NEXT_PUBLIC_WEB_SEARCH_ENABLED,
    updateAgentMode: (agentMode) => {
      set(() => ({
        agentMode,
      }));
    },
    setTools: (tools) => {
      set(() => ({
        tools,
      }));
    },
    updateToolActiveState: (toolName: string) => {
      set((state) => ({
        tools: state.tools.map((tool) =>
          tool.name === toolName ? { ...tool, active: !tool.active } : tool
        ),
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
