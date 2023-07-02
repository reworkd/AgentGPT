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
    icon: <FaHome className="group-hover:text-white" />,
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

export const SOCIAL_LINKS: LinkMetadata[] = [
  {
    name: "Github",
    href: "https://github.com/reworkd/AgentGPT",
    icon: <FaGithub className="group-hover:text-violet-600" />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ReworkdAI",
    icon: <FaTwitter className="group-hover:text-sky-500" />,
  },
  {
    name: "Discord",
    href: "https://discord.gg/gcmNyAAFfV",
    icon: <FaDiscord className="group-hover:text-blue-400" />,
  },
];
