import { FaDiscord, FaGithub, FaQuestion, FaTwitter } from "react-icons/fa";

export const PAGE_LINKS = [
  {
    name: "Help",
    href: "https://docs.reworkd.ai/",
    icon: <FaQuestion className="group-hover:text-red-500" />,
  },
];

export const SOCIAL_LINKS = [
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
