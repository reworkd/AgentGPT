const Drawer = () => {
  return (
    <div
      id="drawer-example"
      className="z-50 m-0 flex h-screen w-72 flex-col gap-2 border-b-[1px] border-b-white/10 bg-[#101010]/50 p-0 p-3 text-white backdrop-blur-sm"
    >
      <NewAgent />
      <DrawerItem text="HustleGPT" />
      <DrawerItem text="ChefGPT" />
      <DrawerItem text="WorldPeaceGPT" />
      <hr className="my-5 border-white/20" />
    </div>
  );
};

const NewAgent = () => {
  return (
    <div className="mb-5 flex flex-row items-center rounded-md border-[1px] border-white/20 p-2 hover:bg-white/5">
      <span className="text-md font-thin">New Agent</span>
    </div>
  );
};

const DrawerItem = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-row items-center rounded-md p-2 hover:bg-white/5">
      <span className="text-md font-thin">{text}</span>
    </div>
  );
};
export default Drawer;
