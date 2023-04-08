import { FaGithub } from "react-icons/fa";
import PopIn from "./popin";
import { AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  return (
    <header className="absolute z-50 flex w-full flex-row items-center justify-end p-2 align-middle">
      <AnimatePresence>
        <PopIn delay={0.5}>
          <a
            href="https://github.com/reworkd/AgentGPT"
            className="right-0 ml-0 block block text-white hover:text-yellow-500"
          >
            <span className="sr-only">AgentGPT on GitHub</span>
            <FaGithub size="25" />
          </a>
        </PopIn>
      </AnimatePresence>
    </header>
  );
};

export default Header;
