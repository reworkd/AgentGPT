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
    <div className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: "conic-gradient(purple, transparent)" }}
      ></div>
      <div
        className={clsx(
          "z-10",
          "flex flex-row items-center justify-center gap-x-4",
          "h-fit w-fit py-2.5 pl-3 pr-4",
          "rounded-[1000px] border-2 border-transparent border-opacity-20 shadow-md",
          "animate-border-pulse bg-black",
          "cursor-pointer"
        )}
      >
        <div>{leftIcon}</div>
        <div className="flex flex-col bg-gradient-to-r from-white to-transparent bg-clip-text font-inter leading-6 tracking-normal text-transparent">
          <h2 className="ml-2s text-[12px] font-semibold md:text-[15px]">{title}</h2>
          <p className="text-[11px] font-medium md:text-[14px]">{subtitle}</p>
        </div>
        <GlowWrapper>
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-[1000px] bg-white">
            {rightIcon}
          </div>
        </GlowWrapper>
      </div>
    </div>
  );
};

export default HeroTimeBanner;
