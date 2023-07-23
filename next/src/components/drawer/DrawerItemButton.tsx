import clsx from "clsx";
import React from "react";

interface DrawerItemProps {
  text: string;
  className?: string;
  onClick?: () => Promise<void> | void;
}

export const DrawerItemButton = (props: DrawerItemProps) => {
  const { text, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(
        "text-color-primary hover:background-color-2 cursor-pointer items-center rounded-md",
        props.className
      )}
      onClick={onClick}
    >
      <span className="text-sm font-light">{text}</span>
    </button>
  );
};

export const DrawerItemButtonLoader = () => {
  return <div className="background-color-4 w-50 mx-1.5 h-7 animate-pulse rounded-md"></div>;
};
