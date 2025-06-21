import { ENGLISH } from "./languages";
import type { ModelSettings, GPTModelNames } from "../types";
import { GPT_35_TURBO, OLLAMA_LLAMA2, MAX_TOKENS } from "../types"; // Import OLLAMA_LLAMA2 and MAX_TOKENS

export const DEFAULT_MAX_LOOPS_FREE = 25 as const;
export const DEFAULT_MAX_LOOPS_CUSTOM_API_KEY = 10 as const;

// Helper to determine if Ollama is likely configured
// This is a client-side heuristic. The backend will ultimately decide.
const isOllamaLikelyConfigured = () => {
  // A simple check, you might want to make this more robust
  // e.g., by checking localStorage or a global variable set by an env var
  return process.env.NEXT_PUBLIC_OLLAMA_ENABLED === "true";
};

export const getDefaultModelSettings = (): ModelSettings => {
  const defaultOpenAIModel: GPTModelNames = GPT_35_TURBO;
  const defaultOllamaModel: GPTModelNames = OLLAMA_LLAMA2;

  // Prefer Ollama if it's likely configured and no custom API key is present
  // This is a heuristic; the backend ultimately determines model availability.
  const customApiKey = typeof window !== "undefined" ? localStorage.getItem("agentgpt-settings-storage-v2") : "";
  const hasCustomApiKey = customApiKey && JSON.parse(customApiKey)?.state?.modelSettings?.customApiKey;


  const preferredModel =
    isOllamaLikelyConfigured() && !hasCustomApiKey
      ? defaultOllamaModel
      : defaultOpenAIModel;

  return {
    customApiKey: "",
    language: ENGLISH,
    customModelName: preferredModel,
    customTemperature: 0.8,
    customMaxLoops: DEFAULT_MAX_LOOPS_FREE,
    maxTokens: MAX_TOKENS[preferredModel] / 2 || 1250, // Default to half of the model's max tokens
  };
};

// This export might not be strictly needed anymore if GPT_MODEL_NAMES from types is used directly.
// However, keeping it for now to avoid breaking other parts of the code that might rely on it.
export { GPT_MODEL_NAMES } from "../types";
