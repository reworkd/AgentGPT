import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";

type HeroTimeBannerProps = {
  title: string;
  subtitle: string;
  leftIcon: ReactNode;
  rightIcon: ReactNode;
  onClick?: () => void;
};

const HeroTimeBanner: React.FC<HeroTimeBannerProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-start justify-center bg-black p-4",
        "max-h-sm  rounded-full shadow-md",
        "max-w-xs border-[1px] border-black border-opacity-20",
        "animate-border-pulse bg-clip-text text-transparent",
        "bg-gradient-to-r from-white to-transparent",

        "cursor-pointer"
      )}
    >
      <div className="mb-2 flex flex-row items-center justify-start">
        <div className="p-4 text-white">{leftIcon}</div>
        <div className="flex flex-col">
          <h2 className="text-md ml-2s font-bold">{title}</h2>
          <p className="mb-4 text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex justify-end p-4 text-white">{rightIcon}</div>
      </div>
    </div>
  );
};

export default HeroTimeBanner;
