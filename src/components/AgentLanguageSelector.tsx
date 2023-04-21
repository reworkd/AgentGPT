import { useState } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface AgentLanguageSelectorProps {
  onChange: (lng: string) => void;
  setCustomLanguage: (lng: string) => void;
}

const AgentLanguageSelector = ({
  onChange,
  setCustomLanguage,
}: AgentLanguageSelectorProps) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "hu", name: "Magyar", flag: "🇭🇺" },
    { code: "ro", name: "Română", flag: "🇷🇴" },
    { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  ];

  const filteredLanguages =
    query === ""
      ? languages
      : languages.filter((lang) => {
          return lang.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    onChange(value);
    setCustomLanguage(value);
  };

  return (
    <ComboboxPrimitive
      value={i18n.language}
      onChange={handleLanguageChange}
    >
      <div className="relative w-full">
        <ComboboxPrimitive.Input
          onChange={handleInputChange}
          className={clsx(
            "border:black delay-50 sm: flex w-full items-center justify-between rounded-xl border-[2px] border-white/10 bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
            "cursor-text",
            "pl-8"
          )}
          placeholder={t('Select language')}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <span role="img" aria-label={i18n.language}>
            {languages.find((lang) => lang.code === i18n.language)?.flag}
          </span>
        </div>
        <ComboboxPrimitive.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
          <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxPrimitive.Button>
        <ComboboxPrimitive.Options className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all ">
          {filteredLanguages.map((lang) => (
            <ComboboxPrimitive.Option
              key={lang.code}
              value={lang.code}
              className="cursor-pointer px-2 py-2"
            >
              {lang.name}
            </ComboboxPrimitive.Option>
          ))}
        </ComboboxPrimitive.Options>
      </div>
    </ComboboxPrimitive>
  );
};

export default AgentLanguageSelector;
