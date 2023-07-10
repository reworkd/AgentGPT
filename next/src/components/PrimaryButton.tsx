import clsx from "clsx";
import Button from "../ui/button";
import React from "react";

type PrimaryButtonProps = {
  children: JSX.Element;
  icon?: React.ReactNode;
  onClick?: () => void;
};
export default function PrimaryButton({ children, onClick, icon }: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "rounded-full border-[1px] border-black shadow-sm",
        "transition duration-200 ease-in-out hover:hover:bg-white/90 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
        "bg-white text-black"
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
