export type ModelSettings = {
  language?: string;
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
