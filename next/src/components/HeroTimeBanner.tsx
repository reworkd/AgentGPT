import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";
import { motion } from "framer-motion";
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
  const rotationVariants = {
    initial: {
      rotate: 0,
    },
    animate: {
      rotate: 360,
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative flex">
      <div className="pointer-events-none absolute inset-0 z-[-10] max-w-[330px] scale-105 transform rounded-full bg-purple-600 opacity-60"></div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-[-5] max-w-[330px] scale-105 transform rounded-full bg-black"
        style={{ maskImage: "linear-gradient(to right, transparent, black)" }}
        variants={rotationVariants}
        initial="initial"
        animate="animate"
      ></motion.div>
      <div
        className={clsx(
          "relative z-10",
          "flex flex-row items-center justify-center gap-x-4",
          "h-fit w-fit py-2.5 pl-3 pr-4",
          "rounded-[1000px] border-2 border-transparent border-opacity-20 shadow-md",
          "bg-black",
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
    </div>
  );
};

export default HeroTimeBanner;
