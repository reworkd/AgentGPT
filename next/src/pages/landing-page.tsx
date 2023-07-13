import React from "react";
import NavLayout from "../components/NavLayout";
import Hero from "../components/landing/Hero";
import FadeIn from "../components/motions/FadeIn";
import FooterLinks from "../components/landing/FooterLinks";
import Backing from "../components/landing/Backing";

const HomePage = () => {
  return (
    <NavLayout>
      <div className="flex w-full justify-center">
        <div className="flex max-w-screen-2xl flex-col items-center justify-center overflow-x-hidden px-5 text-white">
          <div className="flex h-screen w-full flex-col items-start justify-center overflow-x-hidden px-4 text-white lg:pl-16">
            <Hero />
          </div>
        </div>
      </div>

      <FadeIn
        initialY={50}
        duration={3}
        className="z-8 absolute bottom-5 w-full justify-center px-6"
      >
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-inter text-sm font-normal text-white/50">
              &copy; 2023 Reworkd AI, Inc.
            </div>
            <Backing />
          </div>
          <FooterLinks />
        </div>
      </FadeIn>
    </NavLayout>
  );
};

export default HomePage;
