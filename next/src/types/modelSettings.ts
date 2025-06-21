import { type Language } from "../utils/languages";

export const [
  GPT_35_TURBO,
  GPT_35_TURBO_16K,
  GPT_4,
  OLLAMA_LLAMA2,
  OLLAMA_MISTRAL,
  OLLAMA_CODELLAMA,
] = [
  "gpt-3.5-turbo" as const,
  "gpt-3.5-turbo-16k" as const,
  "gpt-4" as const,
  "ollama/llama2" as const,
  "ollama/mistral" as const,
  "ollama/codellama" as const,
];
export const GPT_MODEL_NAMES = [
  GPT_35_TURBO,
  GPT_35_TURBO_16K,
  GPT_4,
  OLLAMA_LLAMA2,
  OLLAMA_MISTRAL,
  OLLAMA_CODELLAMA,
];
export type GPTModelNames =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k"
  | "gpt-4"
  | "ollama/llama2"
  | "ollama/mistral"
  | "ollama/codellama";

export const MAX_TOKENS: Record<GPTModelNames, number> = {
  "gpt-3.5-turbo": 4000,
  "gpt-3.5-turbo-16k": 16000,
  "gpt-4": 8000, // GPT-4 Turbo has 128k, but older versions have 8k or 4k. Let's use a safe default.
  "ollama/llama2": 4096,
  "ollama/mistral": 8192,
  "ollama/codellama": 16000,
};

export interface ModelSettings {
  language: Language;
  customApiKey: string;
  customModelName: GPTModelNames;
  customTemperature: number;
  customMaxLoops: number;
  maxTokens: number;
}
