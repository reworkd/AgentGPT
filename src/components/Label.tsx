import React from "react";

interface LabelProps {
  left?: React.ReactNode;
}

const Label = ({ left }: LabelProps) => {
  return (
    <div className="center flex items-center rounded-xl rounded-r-none border-r-0 border-white/10 py-2 text-lg text-sm font-semibold tracking-wider transition-all sm:py-3 md:w-1/4 md:border-[2px] md:px-5 md:text-lg">
      {left}
    </div>
  );
};

export default Label;
