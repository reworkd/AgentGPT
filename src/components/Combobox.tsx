import { useState, isValidElement } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

type opt = string | JSX.Element;
interface ComboboxProps {
  value: string;
  options: opt[];
  disabled?: boolean;
  onChange: (value: string) => void;
  styleClass?: { [key: string]: string };
}

const Combobox = ({
  options,
  value,
  disabled,
  onChange,
  styleClass,
}: ComboboxProps) => {
  const [query, setQuery] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const getOptionText = (opt: opt): string => {
    if (isValidElement(opt)) {
      return (opt.props as { name: string }).name;
    }

    if (typeof opt === "string") {
      return opt;
    }

    return "";
  };

  const readOnlyInput = options.length <= 0 || typeof options[0] !== "string";

  const filteredOptions: opt[] =
    query === ""
      ? options
      : options.filter((opt) => {
          const option = getOptionText(opt);
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <ComboboxPrimitive value={value} onChange={onChange} disabled={disabled}>
      <div className={styleClass?.container}>
        <ComboboxPrimitive.Input
          onChange={handleInputChange}
          className={styleClass?.input}
          readOnly={readOnlyInput}
        />
        <ComboboxPrimitive.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
          <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxPrimitive.Button>
        <ComboboxPrimitive.Options className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-hidden rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all ">
          {filteredOptions.map((opt: opt) => {
            const option = getOptionText(opt);

            return (
              <ComboboxPrimitive.Option
                key={option}
                value={option}
                className={styleClass?.option}
              >
                {opt}
              </ComboboxPrimitive.Option>
            );
          })}
        </ComboboxPrimitive.Options>
      </div>
    </ComboboxPrimitive>
  );
};

export default Combobox;
