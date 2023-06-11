import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import Input from "../ui/input";
import type { Language } from "../utils/languages";
import { languages } from "../utils/languages";
import type { GPTModelNames } from "../types";
import { GPT_MODEL_NAMES } from "../types";
import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import type { GetStaticProps } from "next";
import { useModelSettingsStore } from "../stores";
import { FaCoins, FaGlobe, FaRobot, FaSyncAlt, FaThermometerFull } from "react-icons/fa";

const SettingsPage = () => {
  const [t] = useTranslation("settings");

  const updateSettings = useModelSettingsStore.use.updateSettings();
  const modelSettings = useModelSettingsStore.use.modelSettings();

  return (
    <SidebarLayout>
      <div className="grid min-h-screen flex-grow place-items-center p-10 lg:p-16">
        <div className="rounded-xl border-2 border-white/20 bg-neutral-900">
          <div className="border-b-2 border-white/20 p-3 sm:p-5">
            <h1 className="text-3xl font-bold dark:text-white md:text-4xl">Settings ⚙</h1>
          </div>
          <div className="p-3 sm:p-5">
            <div className="flex flex-col gap-4">
              <Combo<Language>
                label="Languages"
                value={modelSettings.language}
                valueMapper={(e) => e.name}
                onChange={(e) => updateSettings("language", e)}
                items={languages}
                icon={<FaGlobe />}
              />
              <Combo<GPTModelNames>
                label="Models"
                value={modelSettings.customModelName}
                valueMapper={(e) => e}
                onChange={(e) => updateSettings("customModelName", e)}
                items={GPT_MODEL_NAMES}
                icon={<FaRobot />}
              />
            </div>
            <h1 className="mt-6 text-xl font-bold dark:text-white">Advanced Settings</h1>
            <Input
              label={t("TEMPERATURE")}
              value={modelSettings.customTemperature}
              name="temperature"
              type="range"
              onChange={(e) => updateSettings("customTemperature", parseFloat(e.target.value))}
              attributes={{
                min: 0,
                max: 1,
                step: 0.01,
              }}
              helpText={t("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM")}
              icon={<FaThermometerFull />}
            />
            <Input
              label={t("LOOP")}
              value={modelSettings.customMaxLoops}
              name="loop"
              type="range"
              onChange={(e) => updateSettings("customMaxLoops", parseFloat(e.target.value))}
              attributes={{
                min: 1,
                max: 25,
                step: 1,
              }}
              helpText={t("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS")}
              icon={<FaSyncAlt />}
            />
            <Input
              label={t("TOKENS")}
              value={modelSettings.maxTokens}
              name="tokens"
              type="range"
              onChange={(e) => updateSettings("maxTokens", parseFloat(e.target.value))}
              attributes={{
                min: 200,
                max: 2000,
                step: 100,
              }}
              helpText={t("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION")}
              icon={<FaCoins />}
            />
          </div>
        </div>
      </div>
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
