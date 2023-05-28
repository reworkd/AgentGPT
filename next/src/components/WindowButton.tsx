import React from "react";
import Ping from "./Ping";
import clsx from "clsx";

type WindowButtonProps = {
  ping?: boolean; // Toggles the ping animation
  onClick?: () => void;
  icon: React.ReactNode;
  name: string;
  border?: boolean;
  styleClass?: { [key: string]: string };
};

const WindowButton = ({ ping, onClick, icon, name, border, styleClass }: WindowButtonProps) => {
  return (
    <div
      className={clsx(
        "relative flex h-8 cursor-pointer items-center gap-2 bg-[#3a3a3a] p-2 font-mono font-bold transition-all",
        styleClass?.container,
        border &&
          "rounded-lg border-[1px] border-white/30 hover:border-[#1E88E5]/40 hover:bg-[#6b6b6b]"
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
