import React from "react";
import { FaGithub, FaQuestionCircle, FaRobot, FaTwitter } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import FadeOut from "./motions/FadeOut";
import { AnimatePresence } from "framer-motion";

const Drawer = () => {
  const [agents, setAgents] = React.useState<string[]>([]);

  return (
    <div
      id="drawer"
      className="z-50 m-0 hidden h-screen w-72 flex-col justify-between bg-zinc-900 p-3 font-mono text-white shadow-3xl md:flex"
    >
      <div className="flex flex-col gap-1 overflow-hidden">
        <DrawerItem
          icon={<BiPlus />}
          border
          text="New Agent"
          onClick={() => location.reload()}
        />
        <AnimatePresence>
          {agents.map((agent, index) => (
            <FadeOut key={`${index}-${agent}`}>
              <DrawerItem icon={<FaRobot />} text={agent} />
            </FadeOut>
          ))}

          {agents.length === 0 ? (
            <div>
              Click the above button to restart. In the future, this will be a
              list of your deployed agents!
            </div>
          ) : (
            ""
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-1">
        <hr className="my-5 border-white/20" />
        {/*<DrawerItem*/}
        {/*  icon={<FaTrashAlt />}*/}
        {/*  text="Clear Agents"*/}
        {/*  onClick={() => setAgents([])}*/}
        {/*/>*/}
        <DrawerItem
          icon={<FaQuestionCircle />}
          text="Help"
          onClick={() => alert("No u.")}
        />
        <DrawerItem
          icon={<FaTwitter />}
          text="Twitter"
          onClick={() => window.open("https://twitter.com/", "_blank")}
        />
        <DrawerItem
          icon={<FaGithub />}
          text="GitHub"
          onClick={() =>
            window.open("https://github.com/reworkd/AgentGPT", "_blank")
          }
        />
      </div>
    </div>
  );
};

interface DrawerItemProps {
  icon: React.ReactNode;
  text: string;
  border?: boolean;
  onClick?: () => void;
}

const DrawerItem = ({ icon, text, border, onClick }: DrawerItemProps) => {
  return (
    <div
      className={
        "flex cursor-pointer flex-row items-center rounded-md rounded-md p-2 hover:bg-white/5 " +
        (border ? "mb-2 border-[1px] border-white/20" : "")
      }
      onClick={onClick}
    >
      {icon}
      <span className="text-md ml-4">{text}</span>
    </div>
  );
};
export default Drawer;
