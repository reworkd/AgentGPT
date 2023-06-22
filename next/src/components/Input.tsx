import React from "react";
import Label from "./Label";
import clsx from "clsx";
import Combobox from "./Combobox";
import { isArrayOfType } from "../utils/helpers";
import type { toolTipProperties } from "../types";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputProps {
  small?: boolean; // Will lower padding and font size. Currently only works for the default input
  left?: React.ReactNode;
  value: string | number | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  setValue?: (value: string) => void;
  type?: string;
  subType?: string;
  attributes?: { [key: string]: string | number | string[] }; // attributes specific to input type
  toolTipProperties?: toolTipProperties;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

const Input = (props: InputProps) => {
  const {
    small,
    placeholder,
    left,
    value,
    type,
    onChange,
    setValue,
    disabled,
    attributes,
    inputRef,
    toolTipProperties,
    onKeyDown,
  } = props;
  const [isHidden, setIsHidden] = React.useState(false);

  const isTypeCombobox = () => {
    return type === "combobox";
  };

  const isTypeRange = () => {
    return type === "range";
  };

  const isTypeTextArea = () => {
    return type === "textarea";
  };

  const isTypePassword = () => {
    return type === "password";
  };

  const handleApiKeyToggle = (e) => {
    setIsHidden(!isHidden);
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
        styleClass={{
          container: "relative w-full",
          options:
            "absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border-2 border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all",
          input: `border:black delay-50 sm: flex w-full items-center justify-between rounded-xl border-2 border-white/10 bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg ${
            disabled ? "cursor-not-allowed hover:border-white/10" : ""
          } ${left ? "md:rounded-l-none" : ""}`,
          option:
            "cursor-pointer px-2 py-2 font-mono text-sm text-white/75 hover:bg-blue-500 sm:py-3 md:text-lg",
        }}
      />
    );
  } else if (isTypeTextArea()) {
    inputElement = (
      <textarea
        className={clsx(
          "border:black delay-50 h-15 w-full resize-none rounded-xl border-2 border-white/10 bg-[#3a3a3a] p-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:h-20 md:text-lg",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none"
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        {...attributes}
      />
    );
  } else if (isTypePassword()) {
    inputElement = (
      <div
        className={clsx(
          "flex w-full flex-row items-center overflow-clip rounded-xl border-2 border-white/10 bg-[#3a3a3a]  px-2 hover:border-[#1E88E5]/40 focus:border-[#1E88E5]",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none",
          small && "text-sm sm:py-[0]"
        )}
      >
        <input
          className={clsx(
            "delay-50 w-full  flex-grow overflow-ellipsis   bg-transparent py-1 text-sm tracking-wider outline-0 transition-all  placeholder:text-white/20 sm:py-3 md:text-lg"
          )}
          ref={inputRef}
          placeholder={placeholder}
          type={isHidden ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onKeyDown={onKeyDown}
          {...attributes}
        />
        <div
          className="flex-none cursor-pointer rounded-full p-2 hover:bg-white/20"
          onClick={(e) => handleApiKeyToggle(e)}
        >
          {isHidden ? <FaRegEye /> : <FaRegEyeSlash />}
        </div>
      </div>
    );
  } else {
    inputElement = (
      <input
        className={clsx(
          "border:black delay-50 w-full rounded-xl bg-[#3a3a3a] py-1 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          !isTypeRange() && "border-2 border-white/10 px-2",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none",
          small && "text-sm sm:py-[0]"
        )}
        ref={inputRef}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        {...attributes}
      />
    );
  }

  return (
    <div
      className={clsx(
        `items-left z-5 flex h-fit w-full flex-col rounded-xl font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center md:bg-[#3a3a3a]`,
        isTypeRange() && "md: border-white/10 md:border-2",
        `shadow-xl md:flex-row md:items-center`
      )}
    >
      {left && <Label left={left} type={type} toolTipProperties={toolTipProperties} />}
      {inputElement}
      {isTypeRange() && (
        <p className="m-auto mx-4 w-1/6 px-0 text-center text-sm md:text-lg">{value}</p>
      )}
    </div>
  );
};

export default Input;
