import React from "react";

type WindowButtonProps = {
  ping?: boolean; // Toggles the ping animation
  onClick?: () => void;
  icon: React.ReactNode;
  name: string;
  styleClass?: { [key: string]: string };
};

const WindowButton = ({
  ping,
  onClick,
  icon,
  name,
  styleClass,
}: WindowButtonProps) => {
  return (
    <div
      className={`flex cursor-pointer items-center gap-2 p-1 px-2 text-sm hover:bg-white/10 ${
        styleClass?.container || ""
      }`}
      onClick={onClick}
    >
      {ping ? (
        <span className="absolute right-[-3px] top-[-3px] flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500 opacity-90"></span>
        </span>
      ) : (
        <></>
      )}
      {icon}
      <p className="font-mono">{name}</p>
    </div>
  );
};

export default WindowButton;
