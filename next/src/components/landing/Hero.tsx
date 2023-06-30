import FadeIn from "../motions/FadeIn";
import BannerBadge from "../BannerBadge";
import clsx from "clsx";
import PrimaryButton from "../PrimaryButton";
import Backing from "./Backing";
import React from "react";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="z-40 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div className="col-span-1">
        <FadeIn duration={1.5} delay={0}>
          <div className="mb-2">
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
              "text-4xl md:text-6xl lg:text-7xl",
              "text-left",
              "pb-2",
              "bg-clip-text text-transparent",
              "bg-gradient-to-br from-white to-neutral-600",
              "leading-[1.1em] tracking-[-0.5px]"
            )}
          >
            <div>
              Autonomous AI
              <br />
              Agents At Your
              <br />
              Fingertips
            </div>
          </h1>

          <p className="my-3 mb-9 inline-block w-full text-left align-top font-thin text-neutral-300">
            The leading web-based autonomous agent platform. Automate business processes at scale.
          </p>
          <PrimaryButton
            onClick={() => {
              router.push("/").catch(console.error);
            }}
          >
            Get started
          </PrimaryButton>
        </FadeIn>
      </div>
      <div className="col-span-1 hidden sm:block"></div>
      <FadeIn initialY={30} duration={1.5} delay={0.6} className="absolute bottom-10">
        <Backing />
      </FadeIn>
    </div>
  );
};

export default Hero;
