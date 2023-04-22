import { useState, useEffect } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import Label from "./Label";
import { FaChevronDown, FaFlag } from "react-icons/fa";
import { languages } from "../utils/languages";
import i18n from "../i18n";
import { useTranslation } from "react-i18next"

interface AgentLanguageSelectorComboboxProps {
  disabled: boolean;
  onChange: any;
  value?: string;
}

const AgentLanguageSelectorCombobox = ({
  disabled,
  onChange,
  value,
}: AgentLanguageSelectorComboboxProps) => {
  const [ t ] = useTranslation();
  const [query, setQuery] = useState("");
  const [actualLanguage, setActualLanguage] = useState(
    languages.find((lang) => lang.code === i18n.language)
  );

  useEffect(() => {
    const selectedLanguage = languages.find((lang) => lang.code === i18n.language);
    setActualLanguage(selectedLanguage);
    console.log(selectedLanguage);
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = languages.find((lang) => lang.code === value);
    setActualLanguage(selectedLanguage);
    onChange(selectedLanguage?.name.toUpperCase());
  };

  const filteredOptions =
    query === ""
      ? languages
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(query.toLowerCase())
        );
  const styleClass = {
    container: "relative w-full",
    options:
      "absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-y rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all",
    input:
      "border:black delay-50 sm: flex w-full text-white/75 items-center justify-between rounded-xl border-[2px] border-white/10 bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
    option:
      "cursor-pointer px-2 py-2 font-mono text-sm text-white hover:bg-blue-500 sm:py-3 md:text-lg",
  };

  const left = (
    <>
      <FaFlag />
      <span className="ml-2">{`${t("AgentLanguage")}`}</span>
    </>
  );

  const inputElement = (
    <ComboboxPrimitive
      value={`${actualLanguage?.flag} ${actualLanguage?.name}`}
      onChange={handleLanguageChange}
    >
      <div className={styleClass?.container}>
        <ComboboxPrimitive.Input
          onChange={handleInputChange}
          className={styleClass?.input}
        />
        <ComboboxPrimitive.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
          <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxPrimitive.Button>
        <ComboboxPrimitive.Options className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-hidden rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all">
          {filteredOptions.map((opt) => (
            <ComboboxPrimitive.Option
              key={opt.code}
              value={opt.code}
              className={styleClass?.option}
            >
              <span>{opt.flag}</span>
              <span className="ml-2">{opt.name}</span>
            </ComboboxPrimitive.Option>
          ))}
        </ComboboxPrimitive.Options>
      </div>
    </ComboboxPrimitive>
  );

  return (
    <div
      className={`items-left z-10 flex w-full flex-col rounded-xl font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center md:bg-[#3a3a3a] shadow-xl md:flex-row md:items-center`}
    >
      {left && (
        <Label left={left} />
      )}
      {inputElement}
    </div>
  );
};

export default AgentLanguageSelectorCombobox;
