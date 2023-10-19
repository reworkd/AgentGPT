import axios from "axios";
import clsx from "clsx";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaCoins,
  FaExclamationCircle,
  FaGlobe,
  FaKey,
  FaRobot,
  FaSyncAlt,
  FaThermometerFull,
} from "react-icons/fa";

import nextI18NextConfig from "../../next-i18next.config.js";
import FadeIn from "../components/motions/FadeIn";
import { useAuth } from "../hooks/useAuth";
import type { LLMModel } from "../hooks/useModels";
import { useModels } from "../hooks/useModels";
import { useSettings } from "../hooks/useSettings";
import DashboardLayout from "../layout/dashboard";
import type { GPTModelNames } from "../types";
import Button from "../ui/button";
import Combo from "../ui/combox";
import Input from "../ui/input";
import type { Language } from "../utils/languages";
import { languages } from "../utils/languages";

const SettingsPage = () => {
  const [t] = useTranslation("settings");
  const { settings, updateSettings, updateLangauge } = useSettings();
  const { session } = useAuth({ protectedRoute: true });
  const { models, getModel } = useModels();

  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | undefined>(undefined);

  const validateApiKey = async () => {
    try {
      await axios.get("https://api.openai.com/v1/engines", {
        headers: {
          Authorization: `Bearer ${settings.customApiKey}`,
        },
      });

      setIsApiKeyValid(true);
    } catch (error) {
      setIsApiKeyValid(false);
    }
  };

  const disableAdvancedSettings = !session?.user;
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

  const onDisconnect = () => {
    return Promise.resolve();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex-grow">
        <div className="">
          <FadeIn
            initialX={-45}
            initialY={0}
            delay={0.1}
            className="border-b border-slate-6 px-10 py-10"
          >
            <div>
              {" "}
              <h1 className="text-4xl font-bold text-slate-12">Settings</h1>
              <h2 className="text-xl font-light text-slate-12">Customize your agent experience</h2>
            </div>
          </FadeIn>
          <FadeIn initialY={45} delay={0.1} className="mt-4 px-10">
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
                onChange={(e) => {
                  setIsApiKeyValid(undefined);
                  updateSettings("customApiKey", e.target.value);
                }}
                icon={<FaKey />}
                className="flex-grow-1 mr-2"
                right={
                  <Button
                    onClick={validateApiKey}
                    className={clsx(
                      "transition-400 h-11 w-16 rounded text-sm text-white duration-200",
                      isApiKeyValid === undefined && "bg-gray-500 hover:bg-gray-700",
                      isApiKeyValid === true && "bg-green-500 hover:bg-green-700",
                      isApiKeyValid === false && "bg-red-500 hover:bg-red-700"
                    )}
                  >
                    {isApiKeyValid === undefined && "Test"}
                    {isApiKeyValid === true && <FaCheckCircle />}
                    {isApiKeyValid === false && <FaExclamationCircle />}
                  </Button>
                }
              />
            </div>

            {!disableAdvancedSettings && (
              <div className="mt-4 flex flex-col ">
                <h1 className="pb-4 text-xl font-bold text-slate-12">Advanced Settings</h1>
                <div className="flex flex-col gap-4">
                  <Combo<LLMModel>
                    label="Model"
                    value={model}
                    valueMapper={(e) => e.name}
                    onChange={updateModel}
                    items={models}
                    icon={<FaRobot />}
                  />
                  <Input
                    label={`${t("TEMPERATURE")}`}
                    value={settings.customTemperature}
                    name="temperature"
                    type="range"
                    onChange={(e) =>
                      updateSettings("customTemperature", parseFloat(e.target.value))
                    }
                    attributes={{
                      min: 0,
                      max: 1,
                      step: 0.01,
                    }}
                    helpText={t("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM")}
                    icon={<FaThermometerFull />}
                    disabled={disableAdvancedSettings}
                  />
                  <Input
                    label={`${t("LOOP")}`}
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
                    disabled={disableAdvancedSettings}
                  />
                  <Input
                    label={`${t("TOKENS")}`}
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
                    disabled={disableAdvancedSettings}
                  />
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
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
