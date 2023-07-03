import React from "react";
import NavLayout from "../components/NavLayout";
import Hero from "../components/landing/Hero";
import Sections from "../components/landing/Section";
import ConnectorSection from "../components/landing/ConnectorSection";

const HomePage = () => {
  return (
    <NavLayout>
      <div
        id="background-gradient"
        className="absolute -z-10 h-screen w-full overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(at 100% 0%, #463d66 0, transparent 66%)",
        }}
      />
      <div className="flex w-full justify-center">
        <div className="max-w-screen flex w-full flex-col items-center justify-center overflow-x-hidden px-5 text-white">
          <div className="flex h-screen max-w-screen-xl flex-col items-start justify-center overflow-x-hidden text-white">
            <Hero />
          </div>
          <div id="section" className="flex min-h-screen max-w-screen-xl items-center">
            <div className="flex w-full grid-cols-4 grid-rows-2 flex-col items-center justify-center gap-4 sm:grid">
              <Sections />
            </div>
          </div>
          <ConnectorSection />
        </div>
      </div>
    </NavLayout>
  );
};

export default HomePage;
