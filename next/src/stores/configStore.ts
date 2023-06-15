import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createSelectors } from "./helpers";
import { createJSONStorage, persist } from "zustand/middleware";

interface Config {
  sidebarOpen: boolean;
}

interface ConfigSlice {
  config: Config;
  updateSettings: <Key extends keyof Config>(key: Key, value: Config[Key]) => void;
  toggleSidebar: () => void;
}

const createConfigSlice: StateCreator<ConfigSlice> = (set) => {
  return {
    ...{
      config: {
        sidebarOpen: false,
      },
    },
    updateSettings: <Key extends keyof Config>(key: Key, value: Config[Key]) => {
      set((state) => ({
        config: { ...state.config, [key]: value },
      }));
    },
    toggleSidebar: () => {
      set((state) => ({
        config: { ...state.config, sidebarOpen: !state.config.sidebarOpen },
      }));
    },
  };
};

export const useConfigStore = createSelectors(
  create<ConfigSlice>()(
    persist(
      (...a) => ({
        ...createConfigSlice(...a),
      }),
      {
        name: "agentgpt-config-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
