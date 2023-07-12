import clsx from "clsx";
import Button from "../ui/button";
import React from "react";

type TextButtonProps = {
  children: JSX.Element;
  icon?: React.ReactNode;
  onClick?: () => void;
};
export default function NavbarTextButton({ children, onClick, icon }: TextButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "flex h-8 items-center justify-center rounded-full border-[1px] border-black font-light",
        "transition duration-200 ease-in-out hover:bg-neutral-900 hover:text-neutral-100 focus-visible:bg-neutral-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-500",
        "bg-transparent text-white/60"
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
