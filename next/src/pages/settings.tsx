import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import Input from "../ui/input";
import { ENGLISH, Language, languages } from "../utils/languages";
import { GPT_35_TURBO, GPTModelNames, GPT_MODEL_NAMES } from "../types";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const SettingsPage = () => {
  const [t] = useTranslation();

  const [language, setLanguage] = useState<Language>(ENGLISH);
  const [model, setModel] = useState<GPTModelNames>(GPT_35_TURBO)
  const [temperature, setTemperature] = useState<Number>(0.9);

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

    </SidebarLayout>
  );
};

export default SettingsPage;
