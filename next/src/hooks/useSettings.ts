import { useEffect, useState } from "react";

import { getDefaultModelSettings } from "../utils/constants";
import type { ModelSettings } from "../types";
import { useModelSettingsStore } from "../stores";

export type SettingsModel = {
  settings: ModelSettings;
  updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => void;
};

export function useSettings(): SettingsModel {
  const [_modelSettings, set_ModelSettings] = useState<ModelSettings>(getDefaultModelSettings());
  const modelSettings = useModelSettingsStore.use.modelSettings();
  const updateSettings = useModelSettingsStore.use.updateSettings();

  // The server doesn't have access to local storage so rendering Zustand directly  will lead to a hydration error
  useEffect(() => {
    set_ModelSettings(modelSettings);
  }, [modelSettings]);

  return {
    settings: _modelSettings,
    updateSettings: updateSettings,
  };
}
