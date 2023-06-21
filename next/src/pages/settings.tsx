import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import Input from "../ui/input";
import type { Language } from "../utils/languages";
import { languages } from "../utils/languages";
import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import type { GetStaticProps } from "next";
import { FaCoins, FaGlobe, FaKey, FaRobot, FaSyncAlt, FaThermometerFull } from "react-icons/fa";
import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../hooks/useAuth";
import type { LLMModel } from "../hooks/useModels";
import { useModels } from "../hooks/useModels";
import type { GPTModelNames } from "../types";

const SettingsPage = () => {
  const [t] = useTranslation("settings");
  const { settings, updateSettings, updateLangauge } = useSettings();
  const { session } = useAuth();
  const { models, getModel } = useModels();

  const showAdvancedSettings = session?.user;
  const model = getModel(settings.customModelName) || {
    name: settings.customModelName,
    max_tokens: 2000,
    has_access: true,
  };

  const updateModel = (model: LLMModel) => {
    if (settings.maxTokens > model.max_tokens) {
      updateSettings("maxTokens", model.max_tokens);
    }

    updateSettings("customModelName", model.name as GPTModelNames);
  };

  return (
    <SidebarLayout>
      <div className="grid min-h-screen flex-grow place-items-center p-10 lg:p-16">
        <div className="rounded-xl border-2 border-white/20 bg-neutral-900">
          <div className="border-b-2 border-white/20 p-3 sm:p-5">
            <h1 className="text-3xl font-bold dark:text-white md:text-4xl">Settings ⚙</h1>
          </div>
          <div className="p-3 sm:p-5">
            <div className="flex flex-col gap-3">
              <Combo<Language>
                label="Language"
                value={settings.language}
                valueMapper={(e) => e.name}
                onChange={(e) => {
                  updateLangauge(e).catch(console.error);
                }}
                items={languages}
                icon={<FaGlobe />}
              />
              <Input
                label="API Key"
                name="api-key"
                placeholder="sk..."
                helpText={
                  <span>
                    You can optionally use your own API key here. You can find your API key in your{" "}
                    <a className="link" href="https://platform.openai.com/account/api-keys">
                      OpenAI dashboard.
                    </a>
                  </span>
                }
                type="text"
                value={settings.customApiKey}
                onChange={(e) => updateSettings("customApiKey", e.target.value)}
                icon={<FaKey />}
              />
            </div>
            {showAdvancedSettings && (
              <div className="flex flex-col gap-3">
                <h1 className="mt-6 text-xl font-bold dark:text-white">Advanced Settings</h1>
                <Combo<LLMModel>
                  label="Model"
                  value={model}
                  valueMapper={(e) => e.name}
                  onChange={updateModel}
                  items={models}
                  icon={<FaRobot />}
                />
                <Input
                  label={t("TEMPERATURE")}
                  value={settings.customTemperature}
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
                  value={settings.customMaxLoops}
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
                  value={settings.maxTokens}
                  name="tokens"
                  type="range"
                  onChange={(e) => updateSettings("maxTokens", parseFloat(e.target.value))}
                  attributes={{
                    min: 200,
                    max: model.max_tokens,
                    step: 100,
                  }}
                  helpText={t("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION")}
                  icon={<FaCoins />}
                />
              </div>
            )}
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
