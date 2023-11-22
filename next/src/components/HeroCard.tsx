import type { ReactNode } from "react";
import React from "react";

import GlowWrapper from "./GlowWrapper";
import SparkleIcon from "../../public/icons/sparkle-default-regular.svg";

type HeroCardProps = {
  title: string;
  subtitle: string;
  leftIcon: ReactNode;
};

const HeroCard: React.FC<HeroCardProps> = ({ title, subtitle, leftIcon }) => {
  return (
    <div className="border-gradient -z-10 flex max-h-16 w-72 flex-row items-center justify-center rounded-full p-3">
      <div className="mr-auto flex items-center gap-3">
        <div>{leftIcon}</div>
        <div className="flex flex-col font-inter leading-6 tracking-normal text-transparent">
          <h2 className="ml-2s bg-gradient-to-r from-white to-white/70 bg-clip-text text-[12px] font-semibold  md:text-[15px]">
            {title}
          </h2>
          <p className="bg-gradient-to-r from-white/80 via-white/60 via-[53.18%] to-white/50 bg-clip-text text-[11px] font-medium md:text-[14px]">
            {subtitle}
          </p>
        </div>
      </div>
      <GlowWrapper className="opacity-60">
        <div
          className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white"
          onClick={() => {
            window.open("https://6h6bquxo5g1.typeform.com/to/qscfsOf1", "_blank");
          }}
        >
          <SparkleIcon className="transition-transform group-hover:scale-110" />
        </div>
      </GlowWrapper>
    </div>
  );
};

export default HeroCard;
