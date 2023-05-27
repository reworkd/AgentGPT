import React from "react";
import clsx from "clsx";

interface BadgeProps {
  className?: string;
  colorClass?: string;
  children: React.ReactNode;
}

const Badge = ({ className, colorClass, children }: BadgeProps) => {
  return (
    <div
      className={clsx(
        className,
        colorClass || "bg-sky-500",
        "rounded-full font-semibold text-gray-100 transition-all hover:scale-110",
        "px-1 py-1 text-xs",
        "sm:px-3 sm:py-1 sm:text-sm"
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
