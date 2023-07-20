import type { IconType } from "react-icons";
import {
  FaCog,
  FaDiscord,
  FaFileCode,
  FaGithub,
  FaHome,
  FaLinkedin,
  FaQuestion,
  FaTwitter,
  FaWater,
} from "react-icons/fa";

import { env } from "../../env/client.mjs";

type LinkMetadata = {
  name: string;
  href: string;
  icon: IconType;
  badge?: string;
  className?: string;
  enabled: boolean;
};
export const PAGE_LINKS: LinkMetadata[] = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
    className: "group-hover:text-color-secondary",
    enabled: true,
  },
  {
    name: "Flows",
    href: "/workflow",
    icon: FaWater,
    badge: "Alpha",
    className: "transition-transform group-hover:scale-110",
    enabled: env.NEXT_PUBLIC_EXPERIMENTAL_FF_ENABLED,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FaFileCode,
    badge: "New",
    className: "transition-transform group-hover:scale-110",
    enabled: true,
  },
  {
    name: "Help",
    href: "https://docs.reworkd.ai/",
    icon: FaQuestion,
    className: "group-hover:text-red-500",
    enabled: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FaCog,
    className: "transition-transform group-hover:rotate-90",
    enabled: true,
  },
];

export const SOCIAL_LINKS: LinkMetadata[] = [
  {
    name: "Github",
    href: "https://github.com/reworkd/AgentGPT",
    icon: FaGithub,
    enabled: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ReworkdAI",
    icon: FaTwitter,
    enabled: true,
  },
  {
    name: "Discord",
    href: "https://discord.gg/gcmNyAAFfV",
    icon: FaDiscord,
    enabled: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/reworkd/",
    icon: FaLinkedin,
    enabled: true,
  },
];
