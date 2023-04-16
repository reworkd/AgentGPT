import React from "react";
import Label from "./Label";
import clsx from "clsx";
import Combobox from "./Combobox";
import isArrayOfType from "../utils/helpers";

interface InputProps {
  left?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  setValue?: (value: string) => void;
  type?: string;
  attributes?: { [key: string]: string | number | string[] }; // attributes specific to input type
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Input = (props: InputProps) => {
  const {
    placeholder,
    left,
    value,
    type,
    onChange,
    setValue,
    disabled,
    attributes,
    inputRef,
  } = props;
  const isTypeCombobox = () => {
    return type === "combobox";
  };

  let inputElement;
  const options = attributes?.options;
  if (
    isTypeCombobox() &&
    isArrayOfType(options, "string") &&
    setValue !== undefined
  ) {
    inputElement = (
      <Combobox
        value={value}
        options={options}
        disabled={disabled}
        onChange={setValue}
      />
    );
  } else {
    inputElement = (
      <input
        className={clsx(
          "border:black delay-50 w-full rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] px-2 py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none"
        )}
        ref={inputRef}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="items-left z-10 flex w-full flex-col rounded-xl font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center md:bg-[#3a3a3a]">
      {left && <Label left={left} />}
      {inputElement}
    </div>
  );
};

export default Input;
