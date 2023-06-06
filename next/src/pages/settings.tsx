import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import { ENGLISH, Language, languages } from "../utils/languages";
import { GPT_35_TURBO, GPTModelNames, GPT_MODEL_NAMES } from "../types";
import { useState } from "react";

const SettingsPage = () => {
  const [language, setLanguage] = useState<Language>(ENGLISH);
  const [model, setModel] = useState<GPTModelNames>(GPT_35_TURBO)

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
    </SidebarLayout>
  );
};

export default SettingsPage;
