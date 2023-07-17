import clsx from "clsx";
import type { ReactNode } from "react";
import React from "react";
import GlowWrapper from "./GlowWrapper";
import SparkleIcon from "../../public/icons/sparkle-default-regular.svg";

type HeroCardProps = {
  title: string;
  subtitle: string;
  leftIcon: ReactNode;
  onClick?: () => void;
};

const HeroCard: React.FC<HeroCardProps> = ({ title, subtitle, leftIcon, onClick }) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-center",
        "max-h-20 w-72 p-3",
        "rounded-full border border-white/20",
        "bg-black bg-clip-text text-transparent",
        "-z-10 bg-gradient-to-r from-white to-transparent",
        "cursor-pointer"
      )}
    >
      <div className="mr-auto flex gap-3">
        <div>{leftIcon}</div>
        <div className="flex flex-col font-inter tracking-normal">
          <h2 className="ml-2s text-[12px] font-semibold md:text-[15px]">{title}</h2>
          <p className="text-[11px] font-medium md:text-[14px]">{subtitle}</p>
        </div>
      </div>
      <GlowWrapper>
        <div className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <SparkleIcon className="transition-transform group-hover:scale-110" />
        </div>
      </GlowWrapper>
    </div>
  );
};

export default HeroCard;
