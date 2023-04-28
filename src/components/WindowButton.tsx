import PopIn from "./motions/popin";
import React, { memo } from "react";

type WindowButtonProps = {
  ping?: boolean; // Toggles the ping animation
  delay: number;
  onClick?: () => void;
  icon: React.ReactNode;
  name: string;
  styleClass?: { [key: string]: string };
};

const WindowButton = ({
  ping,
  delay,
  onClick,
  icon,
  name,
  styleClass,
}: WindowButtonProps) => {
  return (
    <PopIn delay={delay}>
      <div
        className={`flex cursor-pointer items-center gap-2 p-1 px-2 text-sm hover:bg-white/10 ${
          styleClass?.container || ""
        }`}
        onClick={onClick}
      >
        {ping ? (
          <span class="absolute right-[-3px] top-[-3px] flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-sky-500 opacity-90"></span>
          </span>
        ) : (
          <></>
        )}
        {icon}
        <p className="font-mono">{name}</p>
      </div>
    </PopIn>
  );
};

export default memo(WindowButton);
