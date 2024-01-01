import clsx from "clsx";
import React from "react";

interface BadgeProps {
  className?: string;
  colorClass?: string;
  children: React.ReactNode;
}

const Badge = ({ className, colorClass, children }: BadgeProps) => {
  return (
    <div
      className={clsx(
        colorClass || "bg-blue-600",
        className,
        "rounded-full px-2 py-1 text-xs font-semibold text-gray-100 transition-all hover:scale-110 sm:px-3 sm:py-1 sm:text-sm"
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
