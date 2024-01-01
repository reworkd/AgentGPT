import React from "react";

export const ExampleAgentButton = ({
  name,
  children,
  setAgentRun,
}: {
  name: string;
  children: string;
  setAgentRun?: (name: string, goal: string) => void;
}) => {
  const handleClick = () => {
    if (setAgentRun) {
      setAgentRun(name, children);
    }
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg border-2 border-slate-7 bg-slate-1 p-4 text-sm text-slate-12 opacity-90 shadow-depth-2 transition-all duration-300 hover:bg-slate-3 sm:text-base"
      onClick={handleClick}
    >
      <p className="text-lg font-bold">{name}</p>
      <p className="mt-2 text-sm">{children}</p>
    </div>
  );
};
