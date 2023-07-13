import {
  FaCog,
  FaDiscord,
  FaFileCode,
  FaGithub,
  FaHome,
  FaLinkedin,
  FaQuestion,
  FaTwitter,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type LinkMetadata = {
  name: string;
  href: string;
  icon: IconType;
  badge?: string;
  className?: string;
};
export const PAGE_LINKS: LinkMetadata[] = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
    className: "group-hover:text-color-secondary",
  },
  // TODO: Uncomment once enabled
  // {
  //   name: "Flows",
  //   href: "/workflow",
  //   icon: FaWater,
  //   badge: "Alpha",
  //   className: "transition-transform group-hover:scale-110",
  // },
  {
    name: "Templates",
    href: "/templates",
    icon: FaFileCode,
    badge: "New",
    className: "transition-transform group-hover:scale-110",
  },
  {
    name: "Help",
    href: "https://docs.reworkd.ai/",
    icon: FaQuestion,
    className: "group-hover:text-red-500",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FaCog,
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
