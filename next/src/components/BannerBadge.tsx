import type { PropsWithChildren } from "react";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import clsx from "clsx";

type BadgeProps = PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

const BannerBadge = ({ children, className, ...props }: BadgeProps) => (
  <a
    className={clsx(
      "animate-border-pulse group relative flex w-max cursor-pointer items-center gap-2 rounded-full border border-purple-300 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent p-1 pl-2 pr-3 text-sm text-white transition-colors hover:bg-purple-300/10",
      className
    )}
    {...props}
  >
    <IoSparkles className="mx-1" />
    <span>{children}</span>
    <FaChevronRight
      size={10}
      className="font-thin text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
    />
  </a>
);

export default BannerBadge;
