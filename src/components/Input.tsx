import React from "react";

interface InputProps {
  left: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Input = ({ placeholder, left, value, onChange }: InputProps) => {
  return (
    <div className="flex w-full items-center rounded-xl bg-[#3a3a3a] font-mono text-lg text-white/75 shadow-2xl">
      {left != null ? (
        <div className="center flex items-center rounded-xl rounded-r-none border-[2px] border-r-0 border-white/10 px-5 py-3 text-lg font-semibold tracking-wider transition-all">
          {left}
        </div>
      ) : null}
      <input
        className="border:black delay-50 w-full rounded-xl rounded-l-none border-[2px] border-white/10 bg-transparent px-2 py-3 tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/25 focus:border-[#1E88E5]"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
