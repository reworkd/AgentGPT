import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/landing/Hero";
import FooterLinks from "../components/landing/FooterLinks";
import Backing from "../components/landing/Backing";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="min-w-screen grid min-h-screen place-items-center">
      <div className="flex min-h-screen max-w-7xl flex-col justify-between">
        <NavBar />
        <Image src="/stars.svg" alt="stars" fill className="absolute -z-50" />
        <main className="mx-auto max-w-[1440px]">
          <Hero />
        </main>
        <footer className="flex flex-col items-center gap-4 pb-4 lg:flex-row">
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
