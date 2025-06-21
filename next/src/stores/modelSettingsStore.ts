import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSelectors } from "./helpers";
import type { ModelSettings, GPTModelNames } from "../types"; // Import GPTModelNames
import { getDefaultModelSettings } from "../utils/constants";
import { MAX_TOKENS, GPT_35_TURBO, OLLAMA_LLAMA2 } from "../types"; // Import MAX_TOKENS and default models

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
        partialize: (state) => {
          const modelSettings = { ...state.modelSettings };
          const currentModel = modelSettings.customModelName;

          // If the current model is an OpenAI model but no API key is set,
          // and Ollama seems to be an option, switch to a default Ollama model.
          // This is a client-side heuristic.
          const isOpenAIModel = currentModel.startsWith("gpt-");
          const ollamaLikelyEnabled = process.env.NEXT_PUBLIC_OLLAMA_ENABLED === "true"; // Simplified check

          if (isOpenAIModel && !modelSettings.customApiKey && ollamaLikelyEnabled) {
            modelSettings.customModelName = OLLAMA_LLAMA2; // Default Ollama model
          } else if (!Object.keys(MAX_TOKENS).includes(currentModel)) {
            // Fallback if the current model name is somehow invalid
            modelSettings.customModelName = GPT_35_TURBO;
          }

          // Ensure maxTokens is valid for the selected model
          const modelMaxTokens = MAX_TOKENS[modelSettings.customModelName as GPTModelNames] || 4000;
          modelSettings.maxTokens = Math.min(
            modelSettings.maxTokens,
            modelMaxTokens
          );

          return {
            modelSettings,
          };
        },
      }
    )
  )
);

export const resetSettings = () => resetters.forEach((resetter) => resetter());
