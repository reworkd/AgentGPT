import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import clsx from "clsx";

interface BannerBadgeProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  color?: string;
  children: string;
}

const BannerBadge = ({ children, className, color, ...props }: BannerBadgeProps) => {
  color = color || "purple-300";

  const badgeStyles = clsx(
    "group pr-2.5",
    "relative flex w-max cursor-pointer items-center gap-1 rounded-full",
    `border border-${color} pl-2 p-1 text-sm text-${color}`,
    "animate-border-pulse",
    className
  );

  const arrowStyles = clsx(
    `text-${color}`,
    "transition-transform duration-300",
    "transform-gpu group-hover:translate-x-1.5"
  );

  return (
    <a className={badgeStyles} {...props}>
      <IoSparkles className="mx-1" />
      <span>{children}</span>
      <FaArrowRight className={arrowStyles} />
    </a>
  );
};

export default BannerBadge;
