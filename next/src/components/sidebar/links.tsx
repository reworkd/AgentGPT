import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaFileCode,
  FaGear,
  FaGithub,
  FaHouse,
  FaLinkedin,
  FaQuestion,
  FaXTwitter,
} from "react-icons/fa6";

type LinkMetadata = {
  name: string;
  href: string;
  icon: IconType;
  className?: string;
};

export const PAGE_LINKS: LinkMetadata[] = [
  {
    name: "Home",
    href: "/",
    icon: FaHouse,
  },
  {
    name: "Help",
    href: "https://docs.reworkd.ai/",
    icon: FaQuestion,
    className: "group-hover:text-red-500",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FaFileCode,
    className: "transition-transform group-hover:scale-110",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FaGear,
    className: "transition-transform group-hover:rotate-90",
  },
];

export const SOCIAL_LINKS: LinkMetadata[] = [
  {
    name: "Github",
    href: "https://github.com/reworkd/AgentGPT",
    icon: FaGithub,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ReworkdAI",
    icon: FaXTwitter,
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
