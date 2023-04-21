import PopIn from "./motions/popin";
import React from "react";

type WindowButtonProps = {
  delay: number;
  onClick?: () => void;
  icon: React.ReactNode;
  name: string | any;
  text?: string | any;
  styleClass?: any;
};

const WindowButton = ({ delay, onClick, icon, name, text }: WindowButtonProps) => {
  return (
    <PopIn delay={delay}>
      <div
        className="mr-1 flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 p-1 px-2 text-xs hover:bg-white/10"
        onClick={onClick}
      >
        {icon}
        <p className="font-mono">{text}</p>
      </div>
    </PopIn>
  );
};

export default WindowButton;
