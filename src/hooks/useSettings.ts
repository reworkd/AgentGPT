import { useState } from "react";
import type { ModelSettings, SettingModel } from "../utils/types";

import {
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
  GPT_35_TURBO,
} from "../utils/constants";

const SETTINGS_KEY = "AGENTGPT_SETTINGS";
const DEFAULT_SETTINGS: ModelSettings = {
  customApiKey: "",
  customModelName: GPT_35_TURBO,
  customTemperature: 0.9 as const,
  customMaxLoops: DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  maxTokens: 300 as const,
};

const loadSettings = () => {
  const settings = { ...DEFAULT_SETTINGS };

  if (typeof window === "undefined") {
    return settings;
  }

  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    return settings;
  }

  try {
    const obj = JSON.parse(data) as ModelSettings;
    Object.entries(obj).forEach(([key, value]) => {
      if (settings.hasOwnProperty(key)) {
        // @ts-ignore
        settings[key] = value;
      }
    });
  } catch (error) {}

  if (!settings.customApiKey) {
    return { ...DEFAULT_SETTINGS };
  }

  if (
    settings.customApiKey &&
    settings.customMaxLoops === DEFAULT_MAX_LOOPS_FREE
  ) {
    settings.customMaxLoops = DEFAULT_MAX_LOOPS_CUSTOM_API_KEY;
  }

  return settings;
};

export function useSettings(): SettingModel {
  const [settings, setSettings] = useState<ModelSettings>(loadSettings);

  const saveSettings = (settings: ModelSettings) => {
    setSettings(settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const resetSettings = () => {
    localStorage.removeItem(SETTINGS_KEY);
    setSettings((_) => {
      return { ...DEFAULT_SETTINGS };
    });
  };

  return {
    settings,
    saveSettings,
    resetSettings,
  };
}
