import type { IconType } from "react-icons";
import {
  FaBusinessTime,
  FaCog,
  FaDiscord,
  FaFileCode,
  FaGithub,
  FaHome,
  FaLinkedin,
  FaQuestion,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type LinkMetadata = {
  name: string;
  href: string;
  icon: IconType;
  badge?: {
    text: string;
    className?: string;
  };
  className?: string;
};

export const PAGE_LINKS: LinkMetadata[] = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
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
    icon: FaCog,
    className: "transition-transform group-hover:rotate-90",
  },
  {
    name: "Organization",
    href: "/organization",
    icon: FaBusinessTime,
    className: "transition-transform group-hover:scale-110",
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
