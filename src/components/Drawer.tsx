import React from "react";
import { FaRobot } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";

const Drawer = () => {
  return (
    <div
      id="drawer-example"
      className="z-50 m-0 hidden h-screen w-72 flex-col gap-2 border-b-[1px] border-b-white/10 bg-[#101010]/50 p-0 p-3 font-mono text-white backdrop-blur-sm md:flex"
    >
      <NewAgent />
      <DrawerItem icon={<FaRobot />} text="HustleGPT" />
      <DrawerItem icon={<FaRobot />} text="ChefGPT" />
      <DrawerItem icon={<FaRobot />} text="WorldPeaceGPT" />
      <hr className="my-5 border-white/20" />
    </div>
  );
};

const NewAgent = () => {
  return (
    <div className="mb-5 flex flex-row items-center rounded-md border-[1px] border-white/20 p-2 hover:bg-white/5">
      <BiPlus />
      <span className="text-md ml-2">New Agent</span>
    </div>
  );
};

const DrawerItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="flex flex-row items-center rounded-md p-2 hover:bg-white/5">
      {icon}
      <span className="text-md ml-2">{text}</span>
    </div>
  );
};
export default Drawer;
