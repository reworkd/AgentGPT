import React from "react";
import NavLayout from "../components/NavLayout";
import Hero from "../components/landing/Hero";
import Sections from "../components/landing/Section";

const HomePage = () => {
  return (
    <NavLayout>
      <div className="flex w-full justify-center">
        <div className="flex max-w-screen-xl flex-col items-center justify-center overflow-x-hidden px-5 text-white">
          <div className="flex h-screen w-full flex-col items-start justify-center overflow-x-hidden px-4 text-white lg:pl-16">
            <Hero />
          </div>
          <div id="section" className="flex min-h-screen w-full items-center">
            <div className="flex w-full grid-cols-4 grid-rows-2 flex-col items-center justify-center gap-4 sm:grid">
              <Sections />
            </div>
          </div>
          <div className="relative flex w-full items-center"></div>
        </div>
      </div>
    </NavLayout>
  );
};

export default HomePage;
