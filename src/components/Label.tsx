import React from "react";

interface LabelProps {
  left?: React.ReactNode;
  type?: string;
}

const Label = ({ type, left }: LabelProps) => {
  return (
    <div
      className={`center flex items-center rounded-xl rounded-r-none ${
        type !== "range" ? "border-r-0 border-white/10 md:border-[2px]" : ""
      }  py-2 text-sm font-semibold tracking-wider transition-all sm:py-3 md:w-1/4 md:px-5 md:text-lg`}
    >
      {left}
    </div>
  );
};

export default Label;
