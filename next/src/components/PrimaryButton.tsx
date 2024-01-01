import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";

import Button from "../ui/button";

type PrimaryButtonProps = {
  className?: string;
  children: ReactNode | string;
  icon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
};

export default function PrimaryButton({ children, onClick, icon, className }: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "group rounded-full border border-black bg-white text-black transition duration-300 ease-in-out hover:hover:bg-neutral-200 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
        className
      )}
    >
      {icon}
      {children}
    </Button>
  );
}
