import clsx from "clsx";
import Button from "../ui/button";
import type { ReactNode } from "react";
import React from "react";

type PrimaryButtonProps = {
  children: ReactNode | string;
  icon?: React.ReactNode;
  onClick?: () => void;
};
export default function NavbarContactButton({ children, onClick, icon }: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "p-x-3 flex h-8 items-center justify-center rounded-full border-black font-extralight shadow-sm",
        "transition duration-200 ease-in-out hover:hover:bg-white/90 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
        "bg-white text-black"
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
