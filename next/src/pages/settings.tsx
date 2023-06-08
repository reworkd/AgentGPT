import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import type { Language } from "../utils/languages";
import { ENGLISH, languages } from "../utils/languages";
import { useState } from "react";
import { useSettings } from "../hooks/useSettings";

const SettingsPage = () => {
  const [language, setLanguage] = useState<Language>(ENGLISH);
  const settings = useSettings();

  return (
    <SidebarLayout settings={settings}>
      <h1>Settings</h1>
      <Combo<Language>
        label="Languages"
        value={language}
        valueMapper={(e) => e.name}
        onChange={setLanguage}
        items={languages}
      />
    </SidebarLayout>
  );
};

export default SettingsPage;
