import FadeIn from "../motions/FadeIn";
import BannerBadge from "../BannerBadge";
import clsx from "clsx";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaCalculator, FaChevronRight } from "react-icons/fa";
import HeroTimeBanner from "../HeroTimeBanner";
import GamepadIcon from "../../../public/icons/gamepad-purple-solid.svg";
import SparkleIcon from "../../../public/icons/sparkle-default-regular.svg";
import GlowWrapper from "../GlowWrapper";

const Hero: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative grid h-screen grid-cols-1 place-items-center gap-2 lg:grid-cols-2">
      <div className="z-10 col-span-1">
        <FadeIn duration={3} initialY={50} className="flex flex-col gap-12">
          <BannerBadge href="https://calendly.com/reworkdai/enterprise-customers" target="_blank">
            <span className="sm:hidden">Shape AI agents for your business</span>
            <span className="hidden sm:inline">
              Shape the future of AI agents for your business
            </span>
          </BannerBadge>
          <div>
            <h1
              className={clsx(
                "pb-2 text-left font-normal tracking-[.09rem]",
                "text-3xl md:text-5xl lg:text-6xl xl:text-7xl",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-white to-transparent"
              )}
            >
              <div>
                AI Agents at
                <br />
                Your Fingertips.
              </div>
            </h1>
            <div className="w-4/5">
              <p
                className={clsx(
                  "my-3 inline-block w-full font-inter",
                  "text-left align-top font-light leading-[22px]",
                  "tracking-[.08rem]",
                  "bg-gradient-to-r bg-clip-text text-transparent",
                  "from-white via-white via-50% to-neutral-600"
                )}
              >
                Create and deploy AI agents on the web in seconds. Simply give them a name and goal.
                Then experience a new way to accomplish any objective.
              </p>
            </div>
          </div>
          <HeroTimeBanner
            title="Platformer"
            subtitle="A Platformer game builder"
            leftIcon={<GamepadIcon />}
            rightIcon={<SparkleIcon />}
            onClick={() => {
              router.push("/").catch(console.error);
            }}
          />
          <div className="flex flex-col items-center justify-center gap-4 gap-x-5 md:flex-row md:justify-start">
            <GlowWrapper>
              <PrimaryButton
                icon={<Image src="email-24x24.svg" width="24" height="24" alt="Email" />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              >
                <>
                  <span>Contact Us</span>
                  <FaChevronRight size="12" />
                </>
              </PrimaryButton>
            </GlowWrapper>
            <TextButton
              onClick={() => {
                router.push("/").catch(console.error);
              }}
            >
              <>
                <span>Explore AI Agents</span>
                <FaChevronRight size="12" />
              </>
            </TextButton>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Hero;
