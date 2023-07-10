import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import DottedGridBackground from "../components/DottedGridBackground";
import AppHead from "../components/AppHead";
import { useTheme } from "../hooks/useTheme";
import LeftSidebar from "../components/drawer/LeftSidebar";
import type { DisplayProps } from "../components/drawer/Sidebar";
import { SidebarControlButton } from "../components/drawer/Sidebar";

type SidebarSettings = {
  mobile: boolean;
  desktop: boolean;
};

type DashboardLayoutProps = {
  children: ReactNode;
  rightSidebar?: ({ show, setShow }: DisplayProps) => JSX.Element;
};
const DashboardLayout = (props: DashboardLayoutProps) => {
  const [leftSettings, setLeftSettings] = useState({ mobile: false, desktop: true });
  const [rightSettings, setRightSettings] = useState({ mobile: false, desktop: true });

  const setMobile =
    (settings: SidebarSettings, setSettings: (SidebarSettings) => void) => (open: boolean) =>
      setSettings({
        mobile: open,
        desktop: settings.desktop,
      });

  const setDesktop =
    (settings: SidebarSettings, setSettings: (SidebarSettings) => void) => (open: boolean) =>
      setSettings({
        mobile: settings.mobile,
        desktop: open,
      });

  //add event listener to detect OS theme changes
  useTheme();

  return (
    <>
      <AppHead />

      {/* Left sidebar */}
      {/* Mobile */}
      <LeftSidebar show={leftSettings.mobile} setShow={setMobile(leftSettings, setLeftSettings)} />
      <div className={leftSettings.mobile ? "hidden" : "lg:hidden"}>
        <SidebarControlButton
          side="left"
          show={leftSettings.mobile}
          setShow={setMobile(leftSettings, setLeftSettings)}
        />
      </div>
      {/* Desktop */}
      <div className="hidden lg:visible lg:inset-y-0  lg:flex lg:w-64 lg:flex-col">
        <LeftSidebar
          show={leftSettings.desktop}
          setShow={setDesktop(leftSettings, setLeftSettings)}
        />
      </div>
      <div className={leftSettings.desktop ? "hidden" : "hidden lg:block"}>
        <SidebarControlButton
          side="left"
          show={leftSettings.desktop}
          setShow={setDesktop(leftSettings, setLeftSettings)}
        />
      </div>

      {/* Right sidebar */}
      {/* Mobile */}
      {props.rightSidebar && (
        <>
          <props.rightSidebar
            show={rightSettings.mobile}
            setShow={setMobile(rightSettings, setRightSettings)}
          />
          <div className={rightSettings.mobile ? "hidden" : "lg:hidden"}>
            <SidebarControlButton
              side="right"
              show={rightSettings.mobile}
              setShow={setMobile(rightSettings, setRightSettings)}
            />
          </div>
          {/* Desktop sidebar */}
          <div className="hidden lg:visible lg:inset-y-0  lg:flex lg:w-64 lg:flex-col">
            <props.rightSidebar
              show={rightSettings.desktop}
              setShow={setDesktop(rightSettings, setRightSettings)}
            />
          </div>
          <div className={rightSettings.desktop ? "hidden" : "hidden lg:block"}>
            <SidebarControlButton
              side="right"
              show={rightSettings.desktop}
              setShow={setDesktop(rightSettings, setRightSettings)}
            />
          </div>
        </>
      )}

      <main
        className={clsx(
          "bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F] duration-300",
          leftSettings.desktop && "lg:pl-64",
          props.rightSidebar && rightSettings.desktop && "lg:pr-64"
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
