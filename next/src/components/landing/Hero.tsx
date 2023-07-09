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
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="z-10 col-span-1">
        <FadeIn duration={1.5} delay={0}>
          <div className="mb-2">
            <BannerBadge href="https://calendly.com/reworkdai/enterprise-customers" target="_blank">
              <span className="sm:hidden">Shape AI agents for your business</span>
              <span className="hidden sm:inline">
                Shape the future of AI agents for your business
              </span>
            </BannerBadge>
          </div>
          <h1
            className={clsx(
              "pb-2 text-left text-2xl font-medium leading-loose tracking-wide sm:text-6xl md:text-7xl "
            )}
          >
            <div>
              AI Agents at
              <br />
              Your Fingertips.
            </div>
          </h1>
          <p
            className={clsx(
              "text-16 font-inter my-3 mb-9 inline-block w-full text-left align-top font-thin leading-6 tracking-wide"
            )}
          >
            Create and deploy AI agents in the web in seconds. Simply
            <br />
            give them a name and goal. Then experience a new way to
            <br />
            accomplish any objective.
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

      <FadeIn
        initialY={50}
        duration={1.5}
        className="absolute bottom-10 right-0 z-10 flex w-screen justify-center"
      >
        <Backing />
      </FadeIn>
    </div>
  );
};

export default Hero;
