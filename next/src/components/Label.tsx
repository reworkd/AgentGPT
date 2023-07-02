import React from "react";
import Tooltip from "./Tooltip";
import type { toolTipProperties } from "../types";
import clsx from "clsx";

interface LabelProps {
  left?: React.ReactNode;
  type?: string;
  toolTipProperties?: toolTipProperties;
}

const Label = ({ type, left, toolTipProperties }: LabelProps) => {
  const isTypeTextArea = () => {
    return type === "textarea";
  };

  return (
    <Tooltip
      child={
        <div
          className={clsx(
            "center flex min-w-[8em] items-center rounded-xl border-2",
            type !== "range" &&
              "md:rounded-r-none md:border-r-0 md:border-blue-base-light dark:md:border-shade-400-dark",
            "py-2 text-sm font-semibold tracking-wider text-white transition-all md:bg-blue-base-light md:py-3 md:pl-3 md:text-lg dark:md:bg-shade-500-dark",
            isTypeTextArea() && "md:h-20"
          )}
        >
          {left}
        </div>
      }
      sideOffset={0}
      toolTipProperties={toolTipProperties}
    ></Tooltip>
  );
};

export default Label;
