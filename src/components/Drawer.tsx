import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  FaBars,
  FaCog,
  FaDiscord,
  FaGithub,
  FaHeart,
  FaQuestionCircle,
  FaRobot,
  FaRocket,
  FaSignInAlt,
  FaSignOutAlt,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";
import type { Session } from "next-auth";
import { env } from "../env/client.mjs";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import FadingHr from "./FadingHr";

const Drawer = ({
  showHelp,
  showSettings,
}: {
  showHelp: () => void;
  showSettings: () => void;
}) => {
  const [t] = useTranslation("drawer");
  const [showDrawer, setShowDrawer] = useState(true);
  const { session, signIn, signOut, status } = useAuth();
  const router = useRouter();

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

  const sub = api.account.subscribe.useMutation({
    onSuccess: async (url) => {
      if (!url) return;
      await router.push(url);
    },
  });

  const query = api.agent.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const manage = api.account.manage.useMutation({
    onSuccess: async (url) => {
      if (!url) return;
      await router.push(url);
    },
  });

  const toggleDrawer = () => {
    setShowDrawer((prevState) => !prevState);
  };

  const handleSupport = () => {
    const donationUrl = "https://github.com/sponsors/reworkd-admin";
    window.open(donationUrl, "_blank");
  };

  const userAgents = query.data ?? [];

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
          <ul className="flex flex-col gap-2 overflow-auto">
            {userAgents.map((agent, index) => (
                <DrawerItem
                  key={index}
                  icon={<FaRobot />}
                  text={agent.name}
                  className="w-full"
                  onClick={() => void router.push(`/agent?id=${agent.id}`)}
                />
              )
            )}

            {status === "unauthenticated" && (
              <div>
                <a
                  className="link"
                  onClick={() => void signIn()}
                >
                  {t("SIGN_IN")}
                </a>{" "}
                {t("SIGN_IN_NOTICE")}
              </div>
            )}
            {status === "authenticated" && userAgents.length === 0 && (
              <div>
                {t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST")}
              </div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <FadingHr className="my-2" />
          {env.NEXT_PUBLIC_FF_SUB_ENABLED ||
            (router.query.pro && (
              <ProItem sub={sub.mutate} manage={manage.mutate} session={session} />
            ))}
          <AuthItem session={session} signIn={signIn} signOut={signOut} />
          <DrawerItem
            icon={<FaQuestionCircle />}
            text={t("HELP_BUTTON")}
            onClick={showHelp}
          />
          <DrawerItem
            icon={<FaHeart />}
            text={t("SUPPORT_BUTTON")}
            onClick={handleSupport}
          />
          <DrawerItem
            icon={
              <FaCog className="transition-transform group-hover:rotate-90" />
            }
            text={t("SETTINGS_BUTTON")}
            onClick={showSettings}
          />
          <FadingHr className="my-2" />
          <div className="flex flex-row items-center">
            <DrawerItem
              icon={
                <FaDiscord
                  size={30}
                  className="transition-colors group-hover:fill-current group-hover:text-indigo-400"
                />
              }
              text="Discord"
              href="https://discord.gg/jdSBAnmdnY"
              target="_blank"
              small
            />
            <DrawerItem
              icon={
                <FaTwitter
                  size={30}
                  className="transition-colors group-hover:fill-current group-hover:text-sky-500"
                />
              }
              text="Twitter"
              href="https://twitter.com/asimdotshrestha/status/1644883727707959296"
              target="_blank"
              small
            />
            <DrawerItem
              icon={
                <FaGithub
                  size={30}
                  className="transition-colors group-hover:fill-current group-hover:text-purple-500"
                />
              }
              text="GitHub"
              href="https://github.com/reworkd/AgentGPT"
              target="_blank"
              small
            />
          </div>
        </div>
      </div>
    </>
  );
};

interface DrawerItemProps
  extends Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target"> {
  icon: React.ReactNode;
  text: string;
  border?: boolean;
  onClick?: () => Promise<void> | void;
  className?: string;
  small?: boolean;
}

const DrawerItem = (props: DrawerItemProps) => {
  const { icon, text, border, href, target, onClick, className } = props;

  if (href) {
    return (
      <a
        className={clsx(
          "group flex cursor-pointer flex-row items-center rounded-md p-2 hover:bg-white/5",
          border && "border-[1px] border-white/20",
          className
        )}
        href={href}
        target={target ?? "_blank"}
      >
        {icon}
        {!props.small && <span className="text-md ml-4">{text}</span>}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={clsx(
        "group flex cursor-pointer flex-row items-center rounded-md p-2 hover:bg-white/5",
        border && "border-[1px] border-white/20",
        `${className || ""}`
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-md ml-4">{text}</span>
    </button>
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
  const text = session?.user
    ? t("SIGN_OUT")
    : t("SIGN_IN");

  return <DrawerItem icon={icon} text={text} onClick={onClick} />;
};

const ProItem: React.FC<{
  session: Session | null;
  sub: () => void;
  manage: () => void;
}> = ({ sub, manage, session }) => {
  const [t] = useTranslation("drawer");
  const text = session?.user?.subscriptionId
    ? t("ACCOUNT")
    : t("GO_PRO");
  let icon = session?.user ? <FaUser /> : <FaRocket />;
  if (session?.user?.image) {
    icon = <img src={session?.user.image} className="h-6 w-6 rounded-full" alt="User Image" />;
  }

  return (
    <DrawerItem
      icon={icon}
      text={text}
      onClick={async () => {
        if (!session?.user) {
           return await signIn();
        }

        if (session?.user.subscriptionId) {
           return manage();
        } else {
          return sub();
        }
      }}
    />
  );
};

export default Drawer;
