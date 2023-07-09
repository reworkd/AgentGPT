import type { PropsWithChildren } from "react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import clsx from "clsx";

type BadgeProps = PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

const BannerBadge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <a
      className={clsx(
        "group pr-3 transition-colors hover:bg-purple-300/10",
        "relative flex w-max cursor-pointer items-center gap-1 rounded-full",
        "border border-purple-300 p-1 pl-2 text-sm text-purple-300",
        "animate-border-pulse",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <FaArrowRight
        className={clsx(
          "text-purple-300",
          "transition-transform duration-300",
          "group-hover:translate-x-1"
        )}
      />
    </a>
  );
};

export default BannerBadge;
