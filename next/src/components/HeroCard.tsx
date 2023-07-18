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
        "border-gradient rounded-full",
        "-z-10"
      )}
    >
      <div className="mr-auto flex items-center gap-3">
        <div>{leftIcon}</div>
        <div className="flex flex-col font-inter leading-6 tracking-normal text-transparent">
          <h2
            className={clsx(
              "ml-2s text-[12px] font-semibold md:text-[15px]",
              "bg-gradient-to-r from-white to-white/70  bg-clip-text"
            )}
          >
            {title}
          </h2>
          <p
            className={clsx(
              "text-[11px] font-medium md:text-[14px]",
              "bg-gradient-to-r from-white/80 via-white/60 via-[53.18%] to-white/50 bg-clip-text"
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <GlowWrapper>
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
