import React from "react";
import NavLayout from "../components/NavLayout";
import Hero from "../components/landing/Hero";

const HomePage = () => {
  return (
    <NavLayout>
      <div className="flex w-full justify-center">
        <div className="flex max-w-screen-xl flex-col items-center justify-center overflow-x-hidden px-5 text-white">
          <div className="flex h-screen w-full flex-col items-start justify-center overflow-x-hidden px-4 text-white lg:pl-16">
            <Hero />
          </div>
        </div>
      </div>
    </NavLayout>
  );
};

export default HomePage;
