import { motion } from "framer-motion";
import FadeIn from "../motions/FadeIn";
import BannerBadge from "../BannerBadge";
import clsx from "clsx";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import HeroCard from "../HeroCard";
import GamepadIcon from "../../../public/icons/gamepad-purple-solid.svg";
import PlaneIcon from "../../../public/icons/PlaneIcon.svg";
import GlowWrapper from "../GlowWrapper";
import Spline from "@splinetool/react-spline";

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [sliderIndex, setSliderIndex] = useState(0);
  const totalCards = 3;

  const handleSliderButton = (increment: number) => {
    const newIndex = (sliderIndex + increment + totalCards) % totalCards;
    setSliderIndex(newIndex);
  };

  return (
    <div className={clsx("grid grid-cols-1 place-items-center gap-2 md:grid-cols-2", className)}>
      <div className="relative z-10 col-span-1 max-w-full">
        <FadeIn
          duration={3}
          initialY={50}
          className="relative flex flex-col items-center gap-12 sm:items-start"
        >
          <BannerBadge href="https://calendly.com/reworkdai/enterprise-customers" target="_blank">
            <span className="">Reworkd raises a 1.25M pre-seed</span>
          </BannerBadge>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="bg-gradient-to-r from-white to-transparent bg-clip-text pb-2 text-center text-3xl font-normal tracking-[.09rem] text-transparent md:text-left md:text-5xl lg:text-6xl xl:text-7xl">
              <div>
                AI Agents at
                <br />
                Your Fingertips.
              </div>
            </h1>
            <p className="my-3 inline-block bg-gradient-to-r from-white via-white via-50% to-neutral-600 bg-clip-text text-left align-top font-inter font-light leading-[22px] tracking-[.08rem] text-transparent sm:w-4/5">
              Create and deploy AI agents in seconds. Leverage agents to automate the workflows you
              once spent countless human hours on. Experience a new way of working.
            </p>
          </div>
          <div className="relative flex w-full items-center overflow-hidden sm:max-w-[40em]">
            <motion.div
              className="z-20 flex gap-5"
              animate={{ x: `${sliderIndex * -308}px` }}
              transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
            >
              <HeroCard
                title="Platformer"
                subtitle="A Platformer game builder"
                leftIcon={<GamepadIcon />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              />
              <HeroCard
                title="TripAdvisor"
                subtitle="A detailed trip planner"
                leftIcon={<PlaneIcon />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              />
              <HeroCard
                title="TripAdvisor"
                subtitle="A detailed trip planner"
                leftIcon={<PlaneIcon />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              />
            </motion.div>
            <div
              id="tests"
              className="absolute right-0 z-20 h-full w-10 bg-gradient-to-r from-transparent to-black to-75% text-white sm:w-40"
            />
            <button
              onClick={() => handleSliderButton(1)}
              className="group absolute right-10 z-30 flex h-6 w-8 items-center justify-center rounded-full border border-white/20 bg-black bg-gradient-to-r from-white/10 to-black hover:border-white/30"
            >
              <FaChevronRight
                size={10}
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
            <GlowWrapper>
              <PrimaryButton
                icon={<Image src="email-24x24.svg" width="24" height="24" alt="Email" />}
                onClick={() => {
                  window.open("https://6h6bquxo5g1.typeform.com/to/qscfsOf1", "_blank");
                }}
              >
                <>
                  <span className="py-2 font-semibold">Join the Waitlist</span>
                  <FaChevronRight
                    size="10"
                    className="text-gray-400 transition-transform group-hover:translate-x-1"
                  />
                </>
              </PrimaryButton>
            </GlowWrapper>
            <TextButton
              onClick={() => {
                router.push("/").catch(console.error);
              }}
            >
              <>
                <span className="py-2">AI Agents</span>
                <FaChevronRight
                  size="12"
                  className="text-gray-400 transition-transform group-hover:translate-x-1"
                />
              </>
            </TextButton>
          </div>
        </FadeIn>
      </div>
      <FadeIn className="relative z-30 hidden h-[30vw] w-[30vw] md:flex" delay={0.5} duration={3}>
        <div className="absolute -z-10 h-full w-full bg-gradient-radial from-[#1152FA] via-[#882BFE] to-70% opacity-25 blur-lg" />
        <Spline scene="https://prod.spline.design/mXSxjCAUYzLpjDfY/scene.splinecode" />
      </FadeIn>
    </div>
  );
};

export default Hero;
