import React from "react";
import Label from "./Label";
import clsx from "clsx";

interface InputProps {
  left?: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  attributes?: { [key: string]: string | number | undefined }; // attributes specific to input type
}

const Input = ({
  placeholder,
  left,
  value,
  onChange,
  disabled,
  type,
  attributes,
}: InputProps) => {
  function isTypeRange() {
    return type === "range";
  }

  return (
    <div
      className={`items-left z-10 flex w-full flex-col rounded-xl bg-[#3a3a3a] font-mono text-lg text-white/75 ${
        isTypeRange() ? "md: border-white/10 md:border-[2px]" : ""
      } shadow-xl md:flex-row md:items-center`}
    >
      {left && <Label type={type} left={left} />}
      <input
        className={clsx(
          "border:black delay-50 w-full rounded-xl  bg-transparent  py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          !isTypeRange() && "border-[2px] border-white/10 px-2",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none"
        )}
        placeholder={placeholder}
        type={type || "text"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...attributes}
      />
      {isTypeRange() && (
        <p className="m-auto w-1/6 px-0 text-center text-sm">{value}</p>
      )}
    </div>
  );
};

export default Input;
