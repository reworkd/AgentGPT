import clsx from "clsx";
import Button from "../ui/button";
import type { ReactNode } from "react";
import React from "react";

type PrimaryButtonProps = {
  children: ReactNode | string;
  icon?: React.ReactNode;
  onClick?: () => void;
};
export default function PrimaryButton({ children, onClick, icon }: PrimaryButtonProps) {
  return (
    <div className="group relative inline-flex items-center justify-center">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-700 to-purple-700 opacity-70 blur-lg transition-all duration-1000 group-hover:-inset-px group-hover:opacity-100 group-hover:duration-200" />
      <Button
        onClick={onClick}
        className={clsx(
          "relative z-10 rounded-full border-[1px] border-black",
          "transition duration-200 ease-in-out hover:hover:bg-white/90 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
          "bg-white text-black"
        )}
      >
        {icon}
        {children}
      </Button>
    </div>
  );
}
