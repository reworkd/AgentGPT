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
        "flex h-8 items-center justify-center rounded-full pl-2 shadow-sm",
        "ml-4 transition duration-200 ease-in-out hover:hover:bg-white/80",
        "bg-white text-black"
      )}
    >
      {children}
    </Button>
  );
}
