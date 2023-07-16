import clsx from "clsx";
import { motion, useTime, useTransform } from "framer-motion";
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
  const time = useTime();
  const background = useTransform(time, (timeValue) => {
    const baseRotation = (timeValue / 7500) * 360;
    const degree = Math.floor(baseRotation);
    // console.log(`conic-gradient(white ${Math.floor(baseRotation)}deg, transparent)`);
    return `conic-gradient(white ${degree}deg, transparent 0deg)`;
  });

  return (
    <div className="relative flex h-[60px] w-[237px] scale-105 transform items-center justify-center overflow-hidden rounded-[1000px]">
      <div className="absolute z-0">
        <div className="absolute h-80 w-80 rounded-full bg-white opacity-10" />
        <motion.div
          className="h-80 w-80 rounded-full"
          style={{
            background,
          }}
        />
      </div>
      <div
        className={clsx(
          "relative z-10",
          "flex flex-row items-center justify-center gap-x-2",
          "py-2 pl-3 pr-3",
          "rounded-[1000px] shadow-md",
          "bg-black",
          "cursor-pointer"
        )}
      >
        <div>{leftIcon}</div>
        <div className="flex flex-col bg-gradient-to-r from-white via-black via-90% to-black bg-clip-text font-inter text-transparent">
          <h2 className="ml-2s text-[10px] font-semibold md:text-[12px]">{title}</h2>
          <p className="text-[8px] font-medium md:text-[10px]">{subtitle}</p>
        </div>
        <GlowWrapper>
          <div className="relative z-20 flex h-6 w-6 items-center justify-center rounded-[1000px] bg-white">
            {rightIcon}
          </div>
        </GlowWrapper>
      </div>
    </div>
  );
};

export default HeroTimeBanner;
