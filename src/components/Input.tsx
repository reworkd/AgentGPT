import React from "react";
import Label from "./Label";
import clsx from "clsx";
import Combobox from "./Combobox";
import isArrayOfType from "../utils/helpers";

interface InputProps {
  left?: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  setValue?: (value: string) => void;
  type?: string;
  attributes?: { [key: string]: string | number | string[] }; // attributes specific to input type
}

const Input = ({
  placeholder,
  left,
  value,
  type = "text",
  onChange,
  setValue,
  disabled,
  attributes,
}: InputProps) => {
  const isTypeCombobox = () => {
    return type === "combobox";
  };

  const isTypeRange = () => {
    return type === "range";
  };

  let inputElement;
  const options = attributes?.options;
  if (
    isTypeCombobox() &&
    isArrayOfType(options, "string") &&
    setValue !== undefined &&
    typeof value === "string"
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
          "border:black delay-50 w-full rounded-xl  bg-transparent  py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          !isTypeRange() && "border-[2px] border-white/10 px-2",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none"
        )}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...attributes}
      />
    );
  }

  return (
    <div
      className={`items-left z-10 flex w-full flex-col rounded-xl bg-[#3a3a3a] font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center ${
        isTypeRange() ? "md: border-white/10 md:border-[2px]" : ""
      } shadow-xl md:flex-row md:items-center`}
    >
      {left && <Label left={left} />}
      {inputElement}
      {isTypeRange() && (
        <p className="m-auto w-1/6 px-0 text-center text-sm">{value}</p>
      )}
    </div>
  );
};

export default Input;
