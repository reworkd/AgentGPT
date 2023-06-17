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
        `w-full p-3 sm:w-[33%]`,
        `cursor-pointer rounded-lg font-mono text-sm sm:text-base`,
        `blue-button-primary transition-all`
      )}
      onClick={handleClick}
    >
      <p className="text-lg font-black">{name}</p>
      <p className="mt-2 text-sm">{children}</p>
    </div>
  );
};
