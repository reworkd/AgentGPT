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
        "relative flex w-max cursor-pointer items-center gap-2 overflow-hidden rounded-full",
        "border-2 border-[#CC98FF]/20 p-1 text-xs text-[#CC98FF] transition-colors duration-300"
      )}
      onClick={onClick}
    >
      <FaStar className="text-purple-500" />
      <span>{children}</span>
      <div className="animate-glow absolute inset-0 rounded-full border-[#CC98FF] border-opacity-0" />
    </div>
  );
};

export default BannerBadge;
