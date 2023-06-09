import { Language } from "../utils/languages";

export const [GPT_35_TURBO, GPT_4] = ["gpt-3.5-turbo" as const, "gpt-4" as const];
export const GPT_MODEL_NAMES = [GPT_35_TURBO, GPT_4];
export type GPTModelNames = "gpt-3.5-turbo" | "gpt-4";
export interface ModelSettings {
  language?: Language;
  customModelName?: GPTModelNames;
  customTemperature?: number;
  customMaxLoops?: number;
  maxTokens?: number;
}
