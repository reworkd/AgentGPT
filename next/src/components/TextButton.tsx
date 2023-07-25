import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";

import Button from "../ui/button";

type TextButtonProps = {
  children: ReactNode | string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};
export default function TextButton({ children, onClick, icon, className }: TextButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "group rounded-full bg-transparent text-neutral-400 transition duration-200 ease-in-out hover:bg-white/10 hover:text-white focus-visible:bg-neutral-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-500",
        className
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
