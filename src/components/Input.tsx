import React from "react";
import Label from "./Label";
import clsx from "clsx";

interface InputProps {
  left?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Input = ({
  placeholder,
  left,
  value,
  onChange,
  disabled,
}: InputProps) => {
  return (
    <div className="items-left z-10 flex w-full flex-col rounded-xl bg-[#3a3a3a] font-mono text-lg text-white/75 shadow-xl md:flex-row md:items-center">
      {left && <Label left={left} />}
      <input
        className={clsx(
          "border:black delay-50 w-full rounded-xl border-[2px] border-white/10 bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:text-lg",
          disabled && " cursor-not-allowed hover:border-white/10",
          left && "md:rounded-l-none"
        )}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
