import type { PropsWithChildren } from "react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import clsx from "clsx";

type BadgeProps = PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

const BannerBadge = ({ children, className, ...props }: BadgeProps) => {
  const badgeStyles = clsx(
    "group pr-2.5",
    "relative flex w-max cursor-pointer items-center gap-1 rounded-full",
    "border border-purple-300 pl-2 p-1 text-sm text-purple-300",
    "animate-border-pulse",
    className
  );

  const arrowStyles = clsx(
    "text-purple-300",
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
