import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

type BadgeProps = PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

const BannerBadge = ({ children, className, ...props }: BadgeProps) => (
  <div
    className={clsx(
      "rounded-full bg-gradient-to-tl from-[#A02BFE] via-[#02FCF1] to-[#A02BFE] p-[1px] subpixel-antialiased",
      className
    )}
  >
    <a
      className="animate-border-pulse py group relative flex w-max cursor-pointer items-center gap-2 rounded-full bg-black px-4 py-2 text-xs text-white"
      {...props}
    >
      <span>{children}</span>
      <FaChevronRight
        size={10}
        className="font-thin text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  </div>
);

export default BannerBadge;
