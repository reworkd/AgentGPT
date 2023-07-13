import clsx from "clsx";
import Button from "../ui/button";
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
    <button
      className={clsx(
        "flex flex-col items-center justify-center rounded-full bg-black p-4",
        "max-h-sm max-w-md shadow-md transition duration-200 ease-in-out",
        "hover:shadow-lg",
        "border-[1px] border-black border-opacity-20",
        "animate-border-pulse",
        "transition duration-200 ease-in-out hover:bg-white/90 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
      )}
      onClick={onClick}
    >
      <div className="left-align mb-2 flex items-center justify-center">
        {leftIcon}
        <h2 className="ml-2 text-xl font-bold">{title}</h2>
        {rightIcon}
      </div>
      <p className="mb-4 text-sm text-gray-600">{subtitle}</p>
    </button>
  );
};

export default HeroTimeBanner;
