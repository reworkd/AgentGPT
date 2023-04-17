import React from "react";
import Tooltip from "./Tooltip";
import type { toolTipProperties } from "./types";

interface LabelProps {
  left?: React.ReactNode;
  type?: string;
  toolTipProperties?: toolTipProperties;
}

const Label = ({ type, left, toolTipProperties }: LabelProps) => {
  return (
    <Tooltip
      child={
        <div
          className={`center flex items-center rounded-xl rounded-r-none ${
            type !== "range"
              ? "border-white/10 md:border-[2px] md:border-r-0"
              : ""
          }  py-2 text-sm font-semibold tracking-wider transition-all sm:py-3 md:px-5 md:text-lg`}
        >
          {left}
        </div>
      }
      // child={<div>{left}</div>}
      style={{
        parent: `md:w-1/4`,
      }}
      sideOffset={0}
      toolTipProperties={toolTipProperties}
    ></Tooltip>
  );
};

export default Label;
