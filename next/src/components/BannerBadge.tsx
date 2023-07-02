import React from "react";
import { FaStar } from "react-icons/fa";
import clsx from "clsx";

type BannerBadgeProps = {
  children: string;
  onClick: () => void;
};

const BannerBadge = ({ children, onClick }: BannerBadgeProps) => {
  return (
    <div
      className={clsx(
        "relative flex w-max cursor-pointer items-center gap-1 rounded-full font-thin",
        "border-2 border-purple-300/20 p-1 text-xs text-purple-300 transition-colors duration-300",
        "before:absolute before:inset-0 before:animate-pulse before:bg-gradient-to-r before:from-purple-300/20 before:to-transparent"
      )}
      onClick={onClick}
    >
      <FaStar className="ml-2 text-purple-300" />
      <span>{children}</span>
      <div />
    </div>
  );
};

export default BannerBadge;
