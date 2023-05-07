import React from "react";
import Tooltip from "./Tooltip";
import type { toolTipProperties } from "./types";

type IconButtonProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  styleClass?: { [key: string]: string };
  toolTipProperties?: toolTipProperties;
};

const IconButton = ({
  onClick,
  icon,
  disabled = false,
  styleClass,
  toolTipProperties,
}: IconButtonProps) => {
  return (
    <Tooltip
      sideOffset={0}
      style={{
        container: `inline`,
        content: `text-xs w-full`,
      }}
      toolTipProperties={toolTipProperties}
    >
      <button
        className={`flex cursor-pointer items-center gap-2 px-2 text-sm  ${
          styleClass?.container || ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="text-md">{icon}</span>
      </button>
    </Tooltip>
  );
};

export default IconButton;
