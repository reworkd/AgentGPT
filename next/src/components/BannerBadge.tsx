import React from "react";
import { FaArrowRight } from "react-icons/fa";
import clsx from "clsx";

type BannerBadgeProps = {
  children: string;
  onClick: () => void;
};

const BannerBadge = ({ children, onClick }: BannerBadgeProps) => {
  const badgeStyles = clsx(
    "relative flex w-max cursor-pointer items-center gap-1 rounded-full font-thin",
    "border-2 border-purple-300/20 p-1 text-sm text-[#CC98FF] transition-colors duration-300",
    "before:absolute before:inset-0 before:animate-pulse before:bg-gradient-to-r before:from-purple-300/20 before:to-transparent",
    "before:content-' ' before:overflow-hidden before:rounded-full"
  );

  return (
    <div className={badgeStyles} onClick={onClick}>
      <style>{`
        @keyframes pulse-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <span>{children}</span>
      <FaArrowRight className="mx-1 text-[#CC98FF]" />
    </div>
  );
};

export default BannerBadge;
