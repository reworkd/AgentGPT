import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";
import GlowWrapper from "./GlowWrapper";

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
        "flex flex-row items-center justify-center gap-x-4",
        "h-fit w-fit py-2.5 pl-3 pr-4",
        "rounded-[1000px] border-[1px] border-black border-opacity-20 shadow-md",
        "animate-border-pulse bg-clip-text text-transparent",
        "bg-gradient-to-r from-white to-transparent",
        "cursor-pointer"
      )}
    >
      <div>{leftIcon}</div>
      <div className="flex flex-col font-inter leading-6 tracking-normal">
        <h2 className="ml-2s text-[12px] font-semibold md:text-[15px]">{title}</h2>
        <p className="text-[11px] font-medium md:text-[14px]">{subtitle}</p>
      </div>
      <GlowWrapper>
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-[1000px] bg-white">
          {rightIcon}
        </div>
      </GlowWrapper>
    </div>
  );
};

export default HeroTimeBanner;
