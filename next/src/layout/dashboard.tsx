import type { PropsWithChildren } from "react";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import clsx from "clsx";
import DottedGridBackground from "../components/DottedGridBackground";
import AppHead from "../components/AppHead";
import { useTheme } from "../hooks/useTheme";
import Sidebar from "../components/drawer/Sidebar";

const DashboardLayout = (props: PropsWithChildren) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  //add event listener to detect OS theme changes
  useTheme();

  return (
    <>
      <AppHead />

      {/*Mobile sidebar*/}
      <div className="flex h-screen max-h-screen w-64 max-w-xs flex-1 lg:hidden">
        <Sidebar show={mobileSidebarOpen} setShow={setMobileSidebarOpen} />
      </div>
      <button
        className={clsx(
          mobileSidebarOpen ? "hidden" : "lg:hidden",
          "background-color-1 hover:background-color-2 fixed z-20 m-2 rounded-md border border-white/20 text-white transition-all"
        )}
        onClick={() => setMobileSidebarOpen(true)}
      >
        <FaBars size="15" className="z-20 m-2" />
      </button>

      {/* Desktop sidebar */}
      <div className={clsx("hidden lg:fixed lg:inset-y-0  lg:flex lg:w-64 lg:flex-col")}>
        <Sidebar show={desktopSidebarOpen} setShow={setDesktopSidebarOpen} />
      </div>
      <button
        className={clsx(
          desktopSidebarOpen ? "hidden" : "hidden lg:block",
          "background-color-1 hover:background-color-2 fixed z-20 m-2 rounded-md border border-white/20 text-white transition-all"
        )}
        onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
      >
        <FaBars size="15" className="z-20 m-2" />
      </button>
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
