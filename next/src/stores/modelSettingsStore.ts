import type { ModelSettings } from "../types";
import { getDefaultModelSettings } from "../utils/constants";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createSelectors } from "./helpers";
import { createJSONStorage, persist } from "zustand/middleware";

const resetters: (() => void)[] = [];

interface ModelSettingsSlice {
  modelSettings: ModelSettings;
  updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => void;
}

const initialModelSettingsState = {
  modelSettings: getDefaultModelSettings(),
};

const createModelSettingsSlice: StateCreator<ModelSettingsSlice> = (set) => {
  resetters.push(() => set(initialModelSettingsState));

  return {
    ...initialModelSettingsState,
    updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => {
      set((state) => ({
        modelSettings: { ...state.modelSettings, [key]: value },
      }));
    },
  };
};

export const useModelSettingsStore = createSelectors(
  create<ModelSettingsSlice>()(
    persist(
      (...a) => ({
        ...createModelSettingsSlice(...a),
      }),
      {
        name: "agentgpt-settings-storage-v2",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          modelSettings: state.modelSettings,
        }),
      }
    )
  )
);

export const resetSettings = () => resetters.forEach((resetter) => resetter());
