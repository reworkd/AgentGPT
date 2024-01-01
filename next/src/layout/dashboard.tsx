import clsx from "clsx";
import type { ReactNode } from "react";
import { useState } from "react";

import AppHead from "../components/AppHead";
import LeftSidebar from "../components/drawer/LeftSidebar";
import { SidebarControlButton } from "../components/drawer/Sidebar";
import { useConfigStore } from "../stores/configStore";

type SidebarSettings = {
  mobile: boolean;
  desktop: boolean;
};

type DashboardLayoutProps = {
  children: ReactNode;
  rightSidebar?: ReactNode;
  onReload?: () => void;
};

const defaultState: SidebarSettings = {
  mobile: false,
  desktop: true,
};

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

const DashboardLayout = (props: DashboardLayoutProps) => {
  const [leftSettings, setLeftSettings] = useState(defaultState);
  const { layout, setLayout } = useConfigStore();

  return (
    <>
      <AppHead />
      {/* Left sidebar */}
      {/* Mobile */}
      <LeftSidebar
        show={leftSettings.mobile}
        setShow={setMobile(leftSettings, setLeftSettings)}
        onReload={props.onReload}
      />
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
          onReload={props.onReload}
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
          <div className="lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">{props.rightSidebar}</div>
          <SidebarControlButton
            side="right"
            show={layout.showRightSidebar}
            setShow={(show) => setLayout({ showRightSidebar: show })}
          />
        </>
      )}
      <main
        className={clsx(
          "bg-gradient-to-b from-slate-7 to-slate-3",
          leftSettings.desktop && "lg:pl-64",
          props.rightSidebar && layout.showRightSidebar && "lg:pr-64"
        )}
      >
        <div className="min-w-screen min-h-screen">{props.children}</div>
      </main>
    </>
  );
};

export default DashboardLayout;
