import { FaGithub } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  return (
    <header className="absolute z-50 flex w-full flex-row items-center justify-end p-2 align-middle">
      <AnimatePresence>
        <a
          href="https://github.com/reworkd/AgentGPT"
          className="right-0 ml-0 block block text-white hover:text-[#1E88E5]"
        >
          <span className="sr-only">AgentGPT on GitHub</span>
          <FaGithub size="25" />
        </a>
      </AnimatePresence>
    </header>
  );
};

export default Header;
