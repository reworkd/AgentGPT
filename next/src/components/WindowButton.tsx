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
        "relative flex h-8 cursor-pointer items-center gap-2 bg-[#3a3a3a] p-2 font-mono text-sm font-bold transition-all hover:bg-white/10",
        border && "rounded-lg border border-white/30 hover:border-[#1E88E5]/40 hover:bg-[#6b6b6b]"
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
