import clsx from "clsx";
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
      className={clsx(
        `w-full p-2`,
        `cursor-pointer rounded-lg text-sm sm:text-base`,
        `bg-gradient-to-t from-sky-300 to-sky-400 shadow-depth-1 transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-500`
      )}
      onClick={handleClick}
    >
      <p className="text-lg font-bold">{name}</p>
      <p className="mt-2 text-sm">{children}</p>
    </div>
  );
};
