import clsx from "clsx";
import React from "react";

import Tooltip from "./Tooltip";
import type { toolTipProperties } from "../types";

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
            "center flex min-w-[8em] items-center rounded-xl md:border-2",
            type !== "range" && "md:rounded-r-none md:border-r-0 md:border-slate-7",
            "py-2 text-sm font-semibold tracking-wider text-slate-10 transition-all md:bg-slate-4 md:py-3 md:pl-3 md:text-lg",
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
