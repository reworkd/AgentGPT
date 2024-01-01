import clsx from "clsx";
import React from "react";

import Ping from "./Ping";

type WindowButtonProps = {
  ping?: boolean; // Toggles the ping animation
  onClick?: () => void;
  icon: React.ReactNode;
  text: string;
  border?: boolean;
};

const WindowButton = ({ ping, onClick, icon, text, border }: WindowButtonProps) => {
  return (
    <div
      className={clsx(
        "relative flex h-8 cursor-pointer items-center gap-2 rounded-lg bg-slate-1 p-2 font-mono text-sm font-bold text-slate-12 transition-all hover:bg-slate-3",
        !border && "rounded-none border-none"
      )}
      onClick={onClick}
    >
      {ping ? <Ping color="blue" /> : <></>}
      {icon}
      <p className="text-gray/50 font-mono">{text}</p>
    </div>
  );
};

export default WindowButton;
