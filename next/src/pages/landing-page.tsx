import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/landing/Hero";
import FooterLinks from "../components/landing/FooterLinks";
import Backing from "../components/landing/Backing";
import Image from "next/image";
import AppHead from "../components/AppHead";

const HomePage = () => {
  return (
    <div className="min-w-screen mx-6 grid min-h-screen place-items-center py-2 selection:bg-purple-700/25 lg:overflow-x-hidden lg:overflow-y-hidden">
      <AppHead title="Reworkd" />
      <Image src="/stars.svg" alt="stars" fill className="absolute -z-50" />

      <div className="flex h-full max-w-[1440px] flex-col justify-between">
        <NavBar />
        <main className="mx-auto sm:px-16">
          <Hero />
        </main>
        <footer className="flex flex-col items-center gap-2 pb-4 lg:flex-row">
          <Backing className="flex-grow" />
          <FooterLinks />
          <div className="font-inter text-sm font-normal text-white/50 lg:order-first">
            &copy; 2023 Reworkd AI, Inc.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
