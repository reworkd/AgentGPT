import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import Input from "../ui/input";
import { Language, languages } from "../utils/languages";
import {
  GPT_MODEL_NAMES,
  GPTModelNames,
  SETTINGS_LANGUAGE,
  SETTINGS_MAX_LOOPS,
  SETTINGS_MAX_TOKEN,
  SETTINGS_MODEL_NAME,
  SETTINGS_TEMPERATURE,
} from "../types";
import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import { GetStaticProps } from "next";
import { useModelSettingsStore } from "../stores";

const SettingsPage = () => {
  const [t] = useTranslation();

  const updateSettings = useModelSettingsStore.use.updateSettings();
  const language = useModelSettingsStore.use[SETTINGS_LANGUAGE]();
  const modelName = useModelSettingsStore.use[SETTINGS_MODEL_NAME]();
  const temperature = useModelSettingsStore.use[SETTINGS_TEMPERATURE]();
  const maxLoops = useModelSettingsStore.use[SETTINGS_MAX_LOOPS]();
  const maxTokens = useModelSettingsStore.use[SETTINGS_MAX_TOKEN]();

  return (
    <SidebarLayout>
      <h1>Settings</h1>
      <Combo<Language>
        label="Languages"
        value={language}
        valueMapper={(e) => e.name}
        onChange={(e) => updateSettings(SETTINGS_LANGUAGE, e)}
        items={languages}
      />
      <Combo<GPTModelNames>
        label="Models"
        value={modelName}
        valueMapper={(e) => e}
        onChange={(e) => updateSettings(SETTINGS_MODEL_NAME, e)}
        items={GPT_MODEL_NAMES}
      />

      <h1 className="mt-6">Advanced Settings</h1>
      <Input
        label={t("TEMPERATURE", { ns: "settings" })}
        value={temperature}
        name="temperature"
        type="range"
        onChange={(e) => updateSettings(SETTINGS_TEMPERATURE, parseFloat(e.target.value))}
        attributes={{
          min: 0,
          max: 1,
          step: 0.01,
        }}
        helpText={t("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM", { ns: "settings" })}
      />
      <Input
        label={t("LOOP", { ns: "settings" })}
        value={maxLoops}
        name="loop"
        type="range"
        onChange={(e) => updateSettings(SETTINGS_MAX_LOOPS, parseFloat(e.target.value))}
        attributes={{
          min: 1,
          max: 25,
          step: 1,
        }}
        helpText={t("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS", { ns: "settings" })}
      />
      <Input
        label={t("TOKENS", { ns: "settings" })}
        value={maxTokens}
        name="tokens"
        type="range"
        onChange={(e) => updateSettings(SETTINGS_MAX_TOKEN, parseFloat(e.target.value))}
        attributes={{
          min: 200,
          max: 2000,
          step: 100,
        }}
        helpText={t("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION", { ns: "settings" })}
      />
    </SidebarLayout>
  );
};

export default SettingsPage;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
