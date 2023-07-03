import {
  FaCog,
  FaDiscord,
  FaFileCode,
  FaGithub,
  FaHome,
  FaQuestion,
  FaTwitter,
} from "react-icons/fa";

type LinkMetadata = {
  name: string;
  href: string;
  icon: JSX.Element;
  badge?: string;
};
export const PAGE_LINKS: LinkMetadata[] = [
  {
    name: "Home",
    href: "/",
    icon: <FaHome className="group-hover:text-color-secondary" />,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: <FaFileCode className="transition-transform group-hover:scale-110" />,
    badge: "New",
  },
  {
    name: "Help",
    href: "https://docs.reworkd.ai/",
    icon: <FaQuestion className="group-hover:text-red-500" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <FaCog className="transition-transform group-hover:rotate-90" />,
  },
];

export const SOCIAL_LINKS = [
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
