import type { PropsWithChildren } from "react";
import { useState } from "react";
import clsx from "clsx";
import DottedGridBackground from "../components/DottedGridBackground";
import AppHead from "../components/AppHead";
import { useTheme } from "../hooks/useTheme";
import Sidebar, { SidebarControlButton } from "../components/drawer/Sidebar";

const DashboardLayout = (props: PropsWithChildren) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  //add event listener to detect OS theme changes
  useTheme();

  return (
    <>
      <AppHead />

      {/*Mobile sidebar*/}
      <Sidebar show={mobileSidebarOpen} setShow={setMobileSidebarOpen} />
      <div className={mobileSidebarOpen ? "hidden" : "lg:hidden"}>
        <SidebarControlButton show={mobileSidebarOpen} setShow={setMobileSidebarOpen} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:visible lg:inset-y-0  lg:flex lg:w-64 lg:flex-col">
        <Sidebar show={desktopSidebarOpen} setShow={setDesktopSidebarOpen} />
      </div>
      <div className={desktopSidebarOpen ? "hidden" : "hidden lg:block"}>
        <SidebarControlButton show={desktopSidebarOpen} setShow={setDesktopSidebarOpen} />
      </div>

      <main
        className={clsx(
          "bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F] duration-300",
          desktopSidebarOpen && "lg:pl-64"
        )}
      >
        <DottedGridBackground className="min-w-screen min-h-screen">
          {props.children}
        </DottedGridBackground>
      </main>
    </>
  );
};

export default DashboardLayout;
