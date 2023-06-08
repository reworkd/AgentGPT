import { Language } from "../utils/languages";

export const [GPT_35_TURBO, GPT_4] = ["gpt-3.5-turbo" as const, "gpt-4" as const];
export const GPT_MODEL_NAMES = [GPT_35_TURBO, GPT_4];
export type GPTModelNames = "gpt-3.5-turbo" | "gpt-4";

export const [SETTINGS_LANGUAGE, SETTINGS_MODEL_NAME, SETTINGS_TEMPERATURE, SETTINGS_MAX_LOOPS, SETTINGS_MAX_TOKEN] = [
  'language' as const, 'customModelName' as const, 'customTemperature' as const, 'customMaxLoops' as const, 'maxTokens' as const
];

export interface ModelSettings {
  [SETTINGS_LANGUAGE]?: Language;
  [SETTINGS_MODEL_NAME]?: GPTModelNames;
  [SETTINGS_TEMPERATURE]?: number;
  [SETTINGS_MAX_LOOPS]?: number;
  [SETTINGS_MAX_TOKEN]?: number;
}
