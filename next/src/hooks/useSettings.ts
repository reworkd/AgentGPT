import { useEffect, useState } from "react";

import { getDefaultModelSettings } from "../utils/constants";
import type { ModelSettings } from "../types";
import { useModelSettingsStore } from "../stores";
import { useRouter } from "next/router";
import type { Language } from "../utils/languages";
import { findLanguage } from "../utils/languages";
import { useTranslation } from "next-i18next";

export type SettingsModel = {
  settings: ModelSettings;
  updateSettings: <Key extends keyof ModelSettings>(key: Key, value: ModelSettings[Key]) => void;
  updateLangauge: (language: Language) => Promise<void>;
};

export function useSettings(): SettingsModel {
  const [_modelSettings, set_ModelSettings] = useState<ModelSettings>(getDefaultModelSettings());
  const modelSettings = useModelSettingsStore.use.modelSettings();
  const updateSettings = useModelSettingsStore.use.updateSettings();
  const router = useRouter();
  const { i18n } = useTranslation();

  // The server doesn't have access to local storage so rendering Zustand directly  will lead to a hydration error
  useEffect(() => {
    set_ModelSettings(modelSettings);
  }, [modelSettings]);

  // We must handle language setting changes uniquely as the router must be the source of truth for the language
  useEffect(() => {
    if (router.locale !== modelSettings.language.code) {
      updateSettings("language", findLanguage(router.locale || "en"));
    }
  }, [router, modelSettings.language, updateSettings]);

  const updateLangauge = async (language: Language): Promise<void> => {
    await i18n.changeLanguage(language.code);
    const { pathname, asPath, query } = router;
    await router.push({ pathname, query }, asPath, {
      locale: language.code,
    });
  };

  return {
    settings: _modelSettings,
    updateSettings: updateSettings,
    updateLangauge: updateLangauge,
  };
}
