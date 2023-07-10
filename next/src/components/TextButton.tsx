import clsx from "clsx";
import Button from "../ui/button";
import React from "react";

type TextButtonProps = {
  children: JSX.Element;
  icon?: React.ReactNode;
  onClick?: () => void;
};
export default function TextButton({ children, onClick, icon }: TextButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "rounded-full",
        "transition duration-200 ease-in-out hover:bg-neutral-900 hover:text-neutral-100 focus-visible:bg-neutral-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-500",
        "bg-transparent text-white/60"
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
