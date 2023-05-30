import React from "react";
import clsx from "clsx";

interface DrawerItemProps {
  icon: React.ReactNode;
  text: string;
  border?: boolean;
  onClick?: () => Promise<void> | void;
}

export const DrawerItemButton = (props: DrawerItemProps) => {
  const { icon, text, border, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(
        "group flex cursor-pointer flex-row items-center rounded-md p-2 hover:bg-white/5",
        border && "border border-white/20"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-4 text-sm">{text}</span>
    </button>
  );
};
