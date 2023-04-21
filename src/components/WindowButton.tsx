import PopIn from "./motions/popin";
import React, { memo } from "react";

type WindowButtonProps = {
  delay: number;
  onClick?: () => void;
  icon: React.ReactNode;
  name: string | any;
  text?: string | any;
  styleClass?: any;
};

const WindowButton = ({ delay, onClick, icon, name, text, styleClass }: WindowButtonProps) => {
  return (
    <PopIn delay={delay}>
      <div
        className={`flex cursor-pointer items-center gap-2 p-1 px-2 text-sm hover:bg-white/10 ${
          styleClass?.container || ""
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
