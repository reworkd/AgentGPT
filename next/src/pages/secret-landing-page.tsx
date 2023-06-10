import React from "react";
import clsx from "clsx";
import NavLayout from "../components/NavLayout";
import BannerBadge from "../components/BannerBadge";
import PrimaryButton from "../components/PrimaryButton";
import { useRouter } from "next/router";
import FadeIn from "../components/motions/FadeIn";

const HomePage = () => {
  const router = useRouter();
  return (
    <NavLayout>
      <div className="flex h-full w-full justify-center bg-black">
        <div className="flex h-full w-full max-w-screen-lg flex-col items-center justify-center  text-white">
          <FadeIn duration={1.5} delay={0}>
            <div className="mb-2 flex w-full justify-center">
              <BannerBadge
                onClick={() =>
                  window.open(
                    "https://calendly.com/reworkdai/enterprise-customers?month=2023-06",
                    "_blank"
                  )
                }
              >
                Shape the future of AI agents for your business
              </BannerBadge>
            </div>
            <h1
              className={clsx(
                "bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent",
                "text-center text-4xl font-bold leading-[42px] tracking-[-0.64px] sm:text-6xl sm:leading-[1.1em]"
              )}
            >
              <div>
                Autonomous AI Agents
                <br />
                at Your Fingertips
              </div>
            </h1>
            <p className="my-2 mb-9 inline-block w-full text-center align-top font-light font-thin text-neutral-300">
              The leading web based autonomous agent platform. Automate business processes at scale.
            </p>
          </FadeIn>
          <FadeIn
            initialY={30}
            duration={1.5}
            delay={0.6}
            className="flex w-full flex-col items-center gap-2 sm:flex-row"
          >
            <div className="flex-1 cursor-text rounded-full border border-white/30 p-3 px-4 font-thin text-neutral-400 transition-colors hover:border-white/60">
              Research the latest trends in AI...
            </div>
            <PrimaryButton
              onClick={() => {
                router.push("/").catch(console.error);
              }}
            >
              Get started
            </PrimaryButton>
          </FadeIn>
        </div>
      </div>
    </NavLayout>
  );
};

export default HomePage;
