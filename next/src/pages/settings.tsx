import SidebarLayout from "../layout/sidebar";
import Combo from "../ui/combox";
import { ENGLISH, Language, languages } from "../utils/languages";
import { useState } from "react";

const SettingsPage = () => {
  const [language, setLanguage] = useState<Language>(ENGLISH);

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
    </SidebarLayout>
  );
};

export default SettingsPage;
