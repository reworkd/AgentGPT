import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ value, onChange }: InputProps) => {
  return (
    <input
      className="shadow-semibold border:black m-3 w-[60%] rounded-xl border-[2px] border-transparent bg-[#3a3a3a] px-2 py-5 font-mono text-lg tracking-wider text-white/75 outline-0 transition-all hover:border-[#1E88E5]/25 focus:border-[#1E88E5]"
      type="text"
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
