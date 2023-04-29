import React, { useState } from "react";
import { useTranslation, i18n } from "next-i18next";
import type { Language } from "../utils/languages";
import { ENGLISH, languages } from "../utils/languages";
import { useRouter } from "next/router";
import Input from "./Input";
import { FaGlobe } from "react-icons/fa";

const LanguageCombobox = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [actualLanguage, setActualLanguage] = useState(
    findLanguage(i18n.language)
  );

  const handleInputChange = (languageName: string) => {
    const selectedLanguage = findLanguage(languageName);
    i18n.changeLanguage(selectedLanguage.code).then(() => {
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
      onChange={(e) => handleInputChange(e.target.value)}
      setValue={(e) => handleInputChange(e)}
      attributes={{
        options: languages.map((lang) => `${lang.flag} ${lang.name}`),
      }}
    />
  );
};

const findLanguage = (nameOrLocale: string): Language => {
  const selectedLanguage = languages.find(
    (lang) =>
      lang.code === nameOrLocale ||
      lang.name === nameOrLocale.substring(4).trim()
  );
  return selectedLanguage || ENGLISH;
};

export default LanguageCombobox;
