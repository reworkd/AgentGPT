import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { SOCIAL_LINKS } from "../sidebar/links";
import BannerBadge from "../BannerBadge";

interface Props {
  className?: string;
}

const Footer = (props: Props) => {
  return (
    <footer className={clsx(props.className, "relative w-full text-sm font-extralight")}>
      <div className="ml-auto mr-auto w-full max-w-7xl px-8 pb-16 text-center">
        <div className="flex w-full flex-col items-center justify-between gap-16 sm:flex-row sm:items-baseline sm:justify-start sm:gap-0">
          <div className="flex">
            <Image src="wordmark.svg" width="200" height="20" alt="Reworkd AI" className="mr-2" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex flex-col gap-6 px-8 text-center text-gray-400 sm:-translate-y-1/2 sm:flex-row sm:text-left md:tracking-wider">
              <a
                className="text-bold text-center"
                href="https://www.ycombinator.com/companies/reworkd/jobs"
                target="_blank"
              >
                Careers
              </a>
              <a className="text-center" href="https://reworkd.ai/privacyPolicy" target="_blank">
                Privacy Policy
              </a>
              <a className="text-center" href="https://reworkd.ai/terms" target="_blank">
                Terms & Conditions
              </a>
            </div>
          </div>
          <div className="flex flex-row gap-8 text-white sm:gap-3">
            {SOCIAL_LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:rotate-6 hover:text-purple-400"
              >
                <span className="sr-only">{link.name}</span>
                <link.icon size={32} className="sm:hidden" />
                <link.icon size={24} className="hidden sm:flex" />
              </a>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-16 w-full border-t border-gray-700/50 sm:mt-4" />
        <div className="flex flex-col gap-4">
          <BannerBadge
            href="https://www.ycombinator.com/companies/reworkd/jobs"
            className="hidden sm:flex"
          >
            {"Interested in AI Agents? We're Hiring!"}
          </BannerBadge>
          <span className="w-full text-xs text-gray-400 sm:text-left">
            &#169;2023 Reworkd AI, Inc.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
