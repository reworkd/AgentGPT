import { useState } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { languages } from "../utils/languages";

interface AgentLanguageSelectorComboboxProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  styleClass?: { [key: string]: string };
}

const AgentLanguageSelectorCombobox = ({
  disabled,
  onChange,
  styleClass,
}: AgentLanguageSelectorComboboxProps) => {
  const [query, setQuery] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const filteredOptions =
    query === ""
      ? languages
      : languages.filter((opt) =>
          opt.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <ComboboxPrimitive value={""} onChange={onChange} disabled={disabled}>
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
              {opt.flag} {opt.name}
            </ComboboxPrimitive.Option>
          ))}
        </ComboboxPrimitive.Options>
      </div>
    </ComboboxPrimitive>
  );
};

export default AgentLanguageSelectorCombobox;
