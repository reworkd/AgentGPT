import React from "react";
import Ping from "./Ping";

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
      {ping ? <Ping color="blue" /> : <></>}
      {icon}
      <p className="font-mono">{name}</p>
    </div>
  );
};

export default WindowButton;
