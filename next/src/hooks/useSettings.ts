import { useEffect, useState } from "react";

import { getDefaultModelSettings } from "../utils/constants";
import type { ModelSettings } from "../types";
import { useModelSettingsStore } from "../stores";
import { useRouter } from "next/router";
import type { Language } from "../utils/languages";
import { i18n } from "next-i18next";

export type SettingsModel = {
  settings: ModelSettings;
  updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => void;
};

export function useSettings(): SettingsModel {
  const [_modelSettings, set_ModelSettings] = useState<ModelSettings>(getDefaultModelSettings());
  const modelSettings = useModelSettingsStore.use.modelSettings();
  const updateSettings = useModelSettingsStore.use.updateSettings();
  const router = useRouter();

  // The server doesn't have access to local storage so rendering Zustand directly  will lead to a hydration error
  useEffect(() => {
    set_ModelSettings(modelSettings);
  }, [modelSettings]);

  // Handle langauge setting changes
  useEffect(() => {
    const handleLanguageChange = async (language: Language): Promise<void> => {
      if (!i18n || router.locale == modelSettings.language.code) {
        return;
      }

      await i18n.changeLanguage(language.code);
      const { pathname, asPath, query } = router;
      await router.push({ pathname, query }, asPath, {
        locale: modelSettings.language.code,
      });
    };

    handleLanguageChange(modelSettings.language).catch(console.error);
  }, [router, modelSettings.language]);

  return {
    settings: _modelSettings,
    updateSettings: updateSettings,
  };
}
