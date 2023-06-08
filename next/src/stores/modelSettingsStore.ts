import {GPT_35_TURBO, ModelSettings} from "../types";
import { DEFAULT_MAX_LOOPS_CUSTOM_API_KEY, DEFAULT_MAX_TOKENS, DEFAULT_MODEL_TEMPERATURE } from "../utils/constants";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createSelectors } from "./helpers";
import { ENGLISH } from "../utils/languages";
import {SETTINGS_LANGUAGE, SETTINGS_TEMPERATURE, SETTINGS_MAX_LOOPS, SETTINGS_MAX_TOKEN, SETTINGS_MODEL_NAME} from "../types";
import {createJSONStorage, persist} from "zustand/middleware";

const resetters: (() => void)[] = [];

type ModelSettingsSlice = Required<ModelSettings> & {
  updateSettings: <Key extends keyof ModelSettingsSlice>(key: Key, value: ModelSettingsSlice[Key]) => void
};

const initialModelSettingsState = {
  [SETTINGS_LANGUAGE]: ENGLISH,
  [SETTINGS_MODEL_NAME]: GPT_35_TURBO,
  [SETTINGS_TEMPERATURE]: DEFAULT_MODEL_TEMPERATURE,
  [SETTINGS_MAX_LOOPS]: DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  [SETTINGS_MAX_TOKEN]: DEFAULT_MAX_TOKENS
}

const createModelSettingsSlice: StateCreator<ModelSettingsSlice> = (set) => {
  resetters.push(() => set(initialModelSettingsState));

  return {
    ...initialModelSettingsState,
    updateSettings: <Key extends keyof ModelSettingsSlice>(key: Key, value: ModelSettingsSlice[Key]) => {
      set((state) => ({
        ...state, [key]: value
      }));
    },
  }
}

export const useModelSettingsStore = createSelectors(
  create<ModelSettingsSlice>()(
    persist(
      (...a) => ({
        ...createModelSettingsSlice(...a)
      }),
      {
        name: "agentgpt-settings-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          [SETTINGS_LANGUAGE]: state[SETTINGS_LANGUAGE],
          [SETTINGS_MODEL_NAME]: state[SETTINGS_MODEL_NAME],
          [SETTINGS_TEMPERATURE]: state[SETTINGS_TEMPERATURE],
          [SETTINGS_MAX_LOOPS]: state[SETTINGS_MAX_LOOPS],
          [SETTINGS_MAX_TOKEN]: state[SETTINGS_MAX_TOKEN]
        }),
      }
    )
  )
);

export const resetSettings = () => resetters.forEach((resetter) => resetter());
