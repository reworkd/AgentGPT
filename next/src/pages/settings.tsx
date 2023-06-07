import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import Input from "../ui/input";
import { ENGLISH, Language, languages } from "../utils/languages";
import { GPT_35_TURBO, GPTModelNames, GPT_MODEL_NAMES } from "../types";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import {GetStaticProps} from "next";

const SettingsPage = () => {
  const [t] = useTranslation();

  const [language, setLanguage] = useState<Language>(ENGLISH);
  const [model, setModel] = useState<GPTModelNames>(GPT_35_TURBO)
  const [temperature, setTemperature] = useState<number>(0.9);
  const [loop, setLoop] = useState<number>(10);
  const [token, setToken] = useState<number>(400);

  return (
    <SidebarLayout>
      <h1>Settings</h1>
      <Combo<Language>
        label="Languages"
        value={language}
        valueMapper={(e) => e.name}
        onChange={setLanguage}
        items={languages}
      />
      <Combo<GPTModelNames>
        label="Models"
        value={model}
        valueMapper={(e) => e}
        onChange={setModel}
        items={GPT_MODEL_NAMES}
      />

      <h1 className="mt-6">Advanced Settings</h1>
      <Input
        label={`${t("TEMPERATURE", { ns: "settings" })}`}
        value={temperature}
        name="temperature"
        type="range"
        onChange={(e) => setTemperature(parseFloat(e.target.value))}
        attributes={{
          min: 0,
          max: 1,
          step: 0.01
        }}
        helpText={`${t("HIGHER_VALUES_MAKE_OUTPUT_MORE_RANDOM", {
          ns: "settings",
        })}`}
      />
      <Input
        label={`${t("LOOP", { ns: "settings" })}`}
        value={loop}
        name="loop"
        type="range"
        onChange={(e) => setLoop(parseFloat(e.target.value))}
        attributes={{
          min: 1,
          max: 25,
          step: 1
        }}
        helpText={`${t("CONTROL_THE_MAXIMUM_NUM_OF_LOOPS", {
          ns: "settings",
        })}`}
      />
      <Input
        label={`${t("TOKENS", { ns: "settings" })}`}
        value={token}
        name="tokens"
        type="range"
        onChange={(e) => setToken(parseFloat(e.target.value))}
        attributes={{
          min: 200,
          max: 2000,
          step: 100
        }}
        helpText={`${t("CONTROL_MAXIMUM_OF_TOKENS_DESCRIPTION", {
          ns: "settings",
        })}`}
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
