import React from "react";
import Ping from "./Ping";
import clsx from "clsx";

type WindowButtonProps = {
  ping?: boolean; // Toggles the ping animation
  onClick?: () => void;
  icon: React.ReactNode;
  name: string;
  border?: boolean;
};

const WindowButton = ({ ping, onClick, icon, name, border }: WindowButtonProps) => {
  return (
    <div
      className={clsx(
        "neutral-button-primary relative flex h-8 cursor-pointer items-center gap-2 rounded-lg p-2 font-mono text-sm font-bold transition-all hover:bg-white/10",
        !border && "rounded-none border-none"
      )}
      onClick={onClick}
    >
      {ping ? <Ping color="blue" /> : <></>}
      {icon}
      <p className="text-gray/50 font-mono">{name}</p>
    </div>
  );
};

export default WindowButton;
