import PopIn from "./motions/popin";
import React, { memo } from "react";

type WindowButtonProps = {
  delay: number;
  onClick?: () => void;
  icon: React.ReactNode;
  name: string;
  disabled?: boolean;
};

const WindowButton = ({
  delay,
  onClick,
  icon,
  name,
  disabled,
}: WindowButtonProps) => {
  return (
    <PopIn delay={delay}>
      <div
        className={`flex cursor-pointer items-center gap-2 p-1 px-2 text-xs hover:bg-white/10 md:text-sm ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={onClick}
      >
        {icon}
        <p className="font-mono">{name}</p>
      </div>
    </PopIn>
  );
};

export default memo(WindowButton);
