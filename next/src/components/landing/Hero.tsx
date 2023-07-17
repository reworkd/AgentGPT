import { motion } from "framer-motion";
import FadeIn from "../motions/FadeIn";
import BannerBadge from "../BannerBadge";
import clsx from "clsx";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import HeroTimeBanner from "../HeroTimeBanner";
import GamepadIcon from "../../../public/icons/gamepad-purple-solid.svg";
import SparkleIcon from "../../../public/icons/sparkle-default-regular.svg";
import GlowWrapper from "../GlowWrapper";
import Spline from "@splinetool/react-spline";

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [sliderIndex, setSliderIndex] = useState(0);
  const totalCards = 2;

  const handleSliderButton = (increment) => {
    const newIndex = (sliderIndex + increment + totalCards) % totalCards;
    setSliderIndex(newIndex);
  };

  return (
    <div className={clsx("grid grid-cols-1 place-items-center gap-2 md:grid-cols-2", className)}>
      <div className="relative z-10 col-span-1">
        <FadeIn duration={3} initialY={50} className="flex flex-col gap-12">
          <BannerBadge href="https://calendly.com/reworkdai/enterprise-customers" target="_blank">
            <span className="">Reworkd raises a 1.25M pre-seed</span>
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
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 z-10 h-full w-full scale-105 rounded-full bg-gradient-to-r from-transparent via-transparent to-black to-85%" />
            <motion.div
              className="z-20 flex gap-5"
              animate={{ x: `${sliderIndex * -50}%` }}
              transition={{ duration: 0.5 }}
            >
              <HeroTimeBanner
                title="Platformer"
                subtitle="A Platformer game builder"
                leftIcon={<GamepadIcon />}
                rightIcon={<SparkleIcon />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              />
              <HeroTimeBanner
                title="Platformer"
                subtitle="A Platformer game builder"
                leftIcon={<GamepadIcon />}
                rightIcon={<SparkleIcon />}
                onClick={() => {
                  router.push("/").catch(console.error);
                }}
              />
            </motion.div>
            <button
              onClick={() => handleSliderButton(1)}
              className="absolute right-0 z-30 -mt-12 mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 align-middle hover:bg-zinc-500 focus:outline-none"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

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
                <span>Explore AI Agents</span>
                <FaChevronRight
                  size="12"
                  className="text-gray-400 transition-transform group-hover:translate-x-1"
                />
              </>
            </TextButton>
          </div>
        </FadeIn>
      </div>
      <FadeIn className="relative hidden h-[500px] w-[500px] lg:flex" delay={0.5} duration={3}>
        <div className="absolute -z-10 h-full w-full bg-gradient-radial from-[#1152FA] via-[#882BFE] to-80% opacity-25 blur-lg" />
        <Spline scene="https://prod.spline.design/RefrpMARTVaJE6YZ/scene.splinecode" />
      </FadeIn>
    </div>
  );
};

export default Hero;
