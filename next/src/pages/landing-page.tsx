import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/landing/Hero";
import FooterLinks from "../components/landing/FooterLinks";
import Backing from "../components/landing/Backing";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="min-w-screen flex min-h-screen flex-col justify-between px-4 lg:px-12 lg:py-4">
      <Image src="/stars.svg" alt="stars" fill className="absolute" />
      <NavBar />
      <main>
        <Hero className="lg:ml-16" />
      </main>
      <footer className="flex flex-col items-center gap-4 pb-4 lg:flex-row lg:pb-0">
        <Backing className="flex-grow" />
        <FooterLinks />
        <div className="font-inter text-sm font-normal text-white/50 lg:order-first">
          &copy; 2023 Reworkd AI, Inc.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
