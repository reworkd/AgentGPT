import React from "react";
import Label from "./Label";
import clsx from "clsx";

interface DropdownProps {
  left?: React.ReactNode;
  value: string;
  options: string[];
  disabled?: boolean;
  setCustomModelName: (key: string) => void;
}

const Dropdown = ({
  options,
  left,
  value,
  disabled,
  setCustomModelName,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOptionClick = (option: string) => {
    setCustomModelName(option);
    handleSetIsOpen();
  };

  const handleSetIsOpen = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setCustomModelName(event.target.value);
    }

    setIsOpen(false);
  };

  return (
    <div className="items-left z-10 flex w-full flex-col rounded-xl bg-[#3a3a3a] font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center">
      {left && <Label left={left} />}

      <div className="relative w-full ">
        {
          <input
            className={clsx(
              "border:black delay-50 sm: flex w-full items-center justify-between rounded-xl border-[2px] border-white/10 bg-transparent px-2 py-2 tracking-wider outline-0 transition-all hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3",
              disabled && " cursor-not-allowed hover:border-white/10",
              left && "md:rounded-l-none"
            )}
            value={value}
            disabled={disabled}
            onChange={handleInputChange}
            onClick={() => handleSetIsOpen()}
          />
        }
        {isOpen && (
          <ul className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all ">
            {options.map((option) => (
              <li
                key={option}
                className="cursor-pointer px-4 py-2 font-mono text-sm text-white/75 hover:bg-blue-500 md:text-lg"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
