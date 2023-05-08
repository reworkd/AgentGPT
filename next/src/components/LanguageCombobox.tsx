import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { findLanguage, languages } from "../utils/languages";
import { useRouter } from "next/router";
import Input from "./Input";
import { FaGlobe } from "react-icons/fa";

const LanguageCombobox = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [actualLanguage, setActualLanguage] = useState(
    findLanguage(i18n.language)
  );

  const handleInputChange = async (languageName: string) => {
    const selectedLanguage = findLanguage(languageName);
    await i18n.changeLanguage(selectedLanguage.code).then(() => {
      setActualLanguage(selectedLanguage);
      handleLanguageChange(selectedLanguage.code);
    });
  };

  const handleLanguageChange = (value: string) => {
    const { pathname, asPath, query } = router;
    router
      .push({ pathname, query }, asPath, {
        locale: value,
      })
      .catch(console.error);
  };

  return (
    <Input
      left={
        <>
          <FaGlobe />
          <span className="ml-2">{`${i18n.t("LANG", "LANG", {
            ns: "settings",
          })}`}</span>
        </>
      }
      type="combobox"
      value={`${actualLanguage.flag} ${actualLanguage.name}`}
      onChange={(e) => void handleInputChange(e.target.value)}
      setValue={(e) => void handleInputChange(e)}
      attributes={{
        options: languages.map((lang) => `${lang.flag} ${lang.name}`),
      }}
    />
  );
};

export default LanguageCombobox;
