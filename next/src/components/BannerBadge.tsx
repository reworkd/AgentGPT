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
    "border-2 border-purple-300/20 p-1 text-sm text-[#CC98FF]",
    "animate-border-pulse"
  );

  return (
    <div className={badgeStyles} onClick={onClick}>
      <style>{`
        @keyframes border-pulse-animation {
          0% {
            border-color: rgba(186, 166, 255, 0.2);
          }
          50% {
            border-color: rgba(186, 166, 255, 0.4);
          }
          100% {
            border-color: rgba(186, 166, 255, 0.2);
          }
        }
        
        .animate-border-pulse {
          animation: border-pulse-animation 2s infinite;
        }
      `}</style>
      <span>{children}</span>
      <FaArrowRight className="mx-1 text-[#CC98FF]" />
    </div>
  );
};

export default BannerBadge;
