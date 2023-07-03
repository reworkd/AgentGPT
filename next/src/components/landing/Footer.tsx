import React from "react";
import Image from "next/image";
import { FaDiscord, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import clsx from "clsx";

interface Props {
  className?: string;
}

const links = [
  {
    name: "Github",
    href: "https://github.com/reworkd/AgentGPT",
    icon: FaGithub,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ReworkdAI",
    icon: FaTwitter,
  },
  {
    name: "Discord",
    href: "https://discord.gg/gcmNyAAFfV",
    icon: FaDiscord,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/reworkd/",
    icon: FaLinkedin,
  },
];

const Footer = (props: Props) => {
  return (
    <footer className={clsx(props.className, "relative w-full text-sm font-extralight")}>
      <div className="ml-auto mr-auto w-full max-w-7xl px-8 pb-16 text-center">
        <div className="flex w-full flex-col items-baseline justify-between gap-16 sm:flex-row sm:justify-start sm:gap-0">
          <div className="flex">
            <Image src="wordmark.svg" width="200" height="20" alt="Reworkd AI" className="mr-2" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex flex-col gap-6 px-8 text-center text-gray-400 sm:flex-row sm:text-left md:tracking-wider">
              <a className="text-center" href="https://reworkd.ai/privacyPolicy" target="_blank">
                Privacy Policy
              </a>
              <a className="text-center" href="http://reworkd.ai/terms">
                Terms and Conditions
              </a>
            </div>
          </div>
          <div className="flex flex-row gap-8 text-white sm:hidden">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:rotate-6 hover:text-purple-400"
              >
                <span className="sr-only">{link.name}</span>
                <link.icon size={48} />
              </a>
            ))}
          </div>
          <div className="hidden flex-row gap-3 text-white sm:flex">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:rotate-6 hover:text-purple-400"
              >
                <span className="sr-only">{link.name}</span>
                <link.icon size={24} />
              </a>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-16 w-full border-t border-gray-700/50 sm:mt-8" />
        <span className="w-full text-xs text-gray-400 sm:text-left">
          &#169;2023 Reworkd AI, Inc.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
