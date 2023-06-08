import { GPT_35_TURBO, ModelSettings } from "../types";
import {
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL_TEMPERATURE,
} from "../utils/constants";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createSelectors } from "./helpers";
import { ENGLISH } from "../utils/languages";
import { createJSONStorage, persist } from "zustand/middleware";

const resetters: (() => void)[] = [];

interface ModelSettingsSlice {
  modelSettings: Required<ModelSettings>;
  updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => void;
}

const initialModelSettingsState = {
  modelSettings: {
    language: ENGLISH,
    customModelName: GPT_35_TURBO,
    customTemperature: DEFAULT_MODEL_TEMPERATURE,
    customMaxLoops: DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
    maxTokens: DEFAULT_MAX_TOKENS,
  },
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
        name: "agentgpt-settings-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          modelSettings: state.modelSettings,
        }),
      }
    )
  )
);

export const resetSettings = () => resetters.forEach((resetter) => resetter());
