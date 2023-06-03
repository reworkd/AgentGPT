import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  FaBars,
  FaCog,
  FaDiscord,
  FaGithub,
  FaQuestionCircle,
  FaRobot,
  FaSignInAlt,
  FaSignOutAlt,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import clsx from "clsx";
import { useAuth } from "../../hooks/useAuth";
import type { Session } from "next-auth";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import FadingHr from "../FadingHr";
import { BiPlus } from "react-icons/bi";
import { DrawerItemButton } from "./DrawerItemButton";
import { DrawerUrlButton } from "./DrawerUrlButton";

const Drawer = ({ showHelp, showSettings }: { showHelp: () => void; showSettings: () => void }) => {
  const [t] = useTranslation("drawer");
  const [showDrawer, setShowDrawer] = useState(true);
  const { session, signIn, signOut, status } = useAuth();
  const router = useRouter();
  const query = api.agent.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const userAgents = query.data ?? [];

  useEffect(() => {
    // Function to check if the screen width is for desktop or tablet
    const checkScreenWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 850) {
        // 768px is the breakpoint for tablet devices
        setShowDrawer(true);
      } else {
        setShowDrawer(false);
      }
    };

    // Call the checkScreenWidth function initially
    checkScreenWidth();

    // Set up an event listener for window resize events
    window.addEventListener("resize", checkScreenWidth);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const toggleDrawer = () => {
    setShowDrawer((prevState) => !prevState);
  };

  return (
    <>
      <div
        id="drawer"
        className={clsx(
          showDrawer ? "translate-x-0 md:sticky" : "-translate-x-full",
          "z-30 m-0 flex h-screen w-72 flex-col justify-between bg-zinc-900 p-3 font-mono text-white shadow-3xl transition-all",
          "fixed top-0 "
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="mb-2 flex justify-center gap-2">
            <p className="font-bold">{t("MY_AGENTS")}</p>
            <button
              className={clsx(
                showDrawer ? "-translate-x-2" : "translate-x-12 border-2 border-white/20",
                "absolute right-0 top-2 z-40 rounded-md bg-zinc-900 p-2 text-white transition-all hover:bg-zinc-700 "
              )}
              onClick={toggleDrawer}
            >
              <FaBars />
            </button>
          </div>
          <DrawerItemButton
            icon={<BiPlus size={17} />}
            text={"New Agent"}
            border
            onClick={() => location.reload()}
          />
          <ul className="flex flex-col gap-2 overflow-auto">
            {userAgents.map((agent, index) => (
              <DrawerItemButton
                key={index}
                icon={<FaRobot />}
                text={agent.name}
                onClick={() => void router.push(`/agent?id=${agent.id}`)}
              />
            ))}

            {status === "unauthenticated" && (
              <div className="p-1 text-sm">
                <a className="link" onClick={() => void signIn()}>
                  {t("SIGN_IN")}
                </a>{" "}
                {t("SIGN_IN_NOTICE")}
              </div>
            )}
            {status === "authenticated" && userAgents.length === 0 && (
              <div className="text-sm">{t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST")}</div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          {session?.user && (
            <>
              <FadingHr className="my-2" />
              <div className="flex flex-row items-center justify-center gap-2 text-sm">
                <FaUser />
                {session?.user?.name}
              </div>
            </>
          )}
          <FadingHr className="my-2" />
          <AuthItem session={session} signIn={signIn} signOut={signOut} />
          <DrawerItemButton
            icon={<FaQuestionCircle />}
            text={t("HELP_BUTTON")}
            onClick={showHelp}
          />
          <DrawerItemButton
            icon={<FaCog className="transition-transform group-hover:rotate-90" />}
            text={t("SETTINGS_BUTTON")}
            onClick={showSettings}
          />
          <FadingHr className="my-2" />
          <div className="flex flex-row items-center justify-center gap-2">
            <DrawerUrlButton
              icon={
                <FaDiscord
                  size={27}
                  className="transition-colors group-hover:fill-current group-hover:text-indigo-400"
                />
              }
              href="https://discord.gg/jdSBAnmdnY"
            />
            <DrawerUrlButton
              icon={
                <FaTwitter
                  size={27}
                  className="transition-colors group-hover:fill-current group-hover:text-sky-500"
                />
              }
              href="https://twitter.com/reworkdai"
            />
            <DrawerUrlButton
              icon={
                <FaGithub
                  size={27}
                  className="transition-colors group-hover:fill-current group-hover:text-purple-500"
                />
              }
              href="https://github.com/reworkd/AgentGPT"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const AuthItem: React.FC<{
  session: Session | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}> = ({ signIn, signOut, session }) => {
  const [t] = useTranslation("drawer");
  const icon = session?.user ? <FaSignOutAlt /> : <FaSignInAlt />;
  const onClick = session?.user ? signOut : signIn;
  const text = session?.user ? t("SIGN_OUT") : t("SIGN_IN");

  return <DrawerItemButton icon={icon} text={text} onClick={onClick} />;
};

export default Drawer;
