import React from "react";
import clsx from "clsx";

interface DrawerItemProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
  border?: boolean;
  onClick?: () => Promise<void> | void;
}

export const DrawerItemButton = (props: DrawerItemProps) => {
  const { icon, text, border, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(
        "cursor-pointer items-center rounded-md p-2 text-white hover:bg-white/5",
        border && "border border-white/20",
        props.className
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-4 text-sm">{text}</span>
    </button>
  );
};
