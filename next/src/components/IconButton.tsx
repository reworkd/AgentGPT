import React from "react";
import Tooltip from "./Tooltip";
import type { toolTipProperties } from "../types";

type IconButtonProps = {
  onClick?: () => void;
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  styleClass?: { [key: string]: string };
  toolTipProperties?: toolTipProperties;
};

const IconButton = ({
  onClick,
  name,
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
        className={`flex items-center gap-2 text-sm  ${styleClass?.container || ""}`}
        aria-label={name}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="text-md">{icon}</span>
      </button>
    </Tooltip>
  );
};

export default IconButton;
