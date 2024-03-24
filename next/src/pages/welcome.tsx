import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import FadeIn from "../components/motions/FadeIn";
import PrimaryButton from "../components/PrimaryButton";

const welcome = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    controls.start({
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15, mass: 1 },
    });
  }, [controls]);

  useEffect(() => {
    if (buttonClicked) {
      controls.start({
        opacity: 0,
        transition: { duration: 0.75 },
      });
    }
  }, [buttonClicked, controls]);

  const handleButtonClick = () => {
    setButtonClicked(true);
    setInterval(() => {
      // Wait 1 second and redirect
      router.push("/").catch(console.error);
    }, 1000);
  };

  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <motion.div
        className="max-h-4xl flex h-full w-full max-w-4xl flex-col items-center justify-center text-center font-sans"
        initial={{ scale: 5, y: 1100, opacity: 1 }}
        animate={controls}
      >
        <motion.div>
          <Image
            src="/logos/dark-default-solid.svg"
            width="150"
            height="150"
            alt="Reworkd AI"
            className="m-4"
          />
        </motion.div>
        <FadeIn duration={3} delay={0.45} initialY={-40}>
          <h1 className="mb-6 text-5xl font-semibold tracking-widest text-white">
            Welcome to Reworkd
          </h1>
        </FadeIn>
        <FadeIn duration={2.85} delay={0.6} initialY={-40}>
          <p className="mb-8 max-w-lg text-center font-light text-neutral-500">
            Optimize web scraping with AI Agents that auto-generates, repairs scripts, and ensures uninterrupted data retrieval. Scale your data extraction effortlessly.
          </p>
        </FadeIn>
        <FadeIn duration={2.7} delay={0.75} initialY={-40}>
          <PrimaryButton className="px-16 font-bold" onClick={handleButtonClick}>
            Get Started
          </PrimaryButton>
        </FadeIn>
      </motion.div>
    </div>
  );
};

export default welcome;