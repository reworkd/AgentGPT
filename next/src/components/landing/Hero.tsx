import FadeIn from "../motions/FadeIn";
import BannerBadge from "../BannerBadge";
import clsx from "clsx";
import PrimaryButton from "../PrimaryButton";
import PopIn from "../motions/popin";
import Backing from "./Backing";
import React from "react";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter();

  return (
    <>
      <FadeIn duration={1.5} delay={0}>
        <div className="mb-2 flex w-full justify-center">
          <BannerBadge
            onClick={() =>
              window.open(
                "https://calendly.com/reworkdai/enterprise-customers?month=2023-06",
                "_blank"
              )
            }
          >
            Shape the future of AI agents for your business
          </BannerBadge>
        </div>
        <h1
          className={clsx(
            "bg-gradient-to-br from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent",
            "text-center text-4xl font-bold leading-[42px] tracking-[-0.64px] sm:text-6xl sm:leading-[1.1em]"
          )}
        >
          <div>
            Autonomous AI Agents
            <br />
            at Your Fingertips
          </div>
        </h1>
        <p className="my-2 mb-9 inline-block w-full text-center align-top font-thin text-neutral-300">
          The leading web based autonomous agent platform. Automate business processes at scale.
        </p>
      </FadeIn>
      <FadeIn
        initialY={30}
        duration={1.5}
        delay={0.6}
        className="flex w-full flex-col items-center gap-2 sm:flex-row"
      >
        <div className="w-full cursor-text rounded-full border border-white/30 p-2 px-4 font-thin text-neutral-400 transition-colors hover:border-white/60 sm:flex-1">
          Research the latest trends in AI...
        </div>
        <PrimaryButton
          onClick={() => {
            router.push("/").catch(console.error);
          }}
        >
          Get started
        </PrimaryButton>
      </FadeIn>
      <PopIn delay={1.4} duration={0.75} className="absolute bottom-10">
        <Backing />
      </PopIn>
    </>
  );
};

export default Hero;
