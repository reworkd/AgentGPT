import type { TFunction } from "i18next";

export type ModelSettings = {
  customApiKey?: string;
  customModelName?: string;
  customTemperature?: number;
  customMaxLoops?: number;
  maxTokens?: number;
};

export type SettingModel = {
  settings: ModelSettings;
  saveSettings: (settings: ModelSettings) => void;
  resetSettings: () => void;
};

export type Translation = TFunction<"translation", undefined>;
