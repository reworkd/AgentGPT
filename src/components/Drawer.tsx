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
  const [t] = useTranslation();
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
    onSuccess: async (url: any) => {
      if (!url) return;
      await router.push(url);
    },
  });

  const query = api.agent.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const manage = api.account.manage.useMutation({
    onSuccess: async (url: any) => {
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
            <p className="font-bold">{`${t("MY_AGENTS", { ns: "drawer" })}`}</p>
            <button
              className={clsx(
                showDrawer
                  ? "-translate-x-2"
                  : "translate-x-12 border-2 border-white/20",
                "absolute right-0 top-2 z-40 rounded-md bg-zinc-900 p-2 text-white transition-all hover:bg-zinc-700 "
              )}
              onClick={toggleDrawer}
            >
              <FaBars />
            </button>
          </div>
          <ul className="flex flex-col gap-2 overflow-auto">
            {userAgents.map(
              (agent: any | undefined, index: any | undefined) => (
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
                  onClick={() => {
                    signIn();
                  }}
                >
                  {`${t("SIGN_IN", { ns: "drawer" })}`}
                </a>{" "}
                {`${t("SIGN_IN_NOTICE", { ns: "drawer" })}`}
              </div>
            )}
            {status === "authenticated" && userAgents.length === 0 && (
              <div>
                {`${t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST", {
                  ns: "drawer",
                })}`}
              </div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <FadingHr className="my-2" />
          {env.NEXT_PUBLIC_FF_SUB_ENABLED ||
            (router.query.pro && (
              <ProItem
                sub={sub.mutate}
                manage={manage.mutate}
                session={session}
              />
            ))}
          {env.NEXT_PUBLIC_FF_AUTH_ENABLED && (
            <AuthItem session={session} signIn={signIn} signOut={signOut} />
          )}
          <DrawerItem
            icon={<FaQuestionCircle />}
            text={`${t("HELP_BUTTON", { ns: "drawer" })}`}
            onClick={showHelp}
          />
          <DrawerItem
            icon={<FaHeart />}
            text={`${t("SUPPORT_BUTTON", { ns: "drawer" })}`}
            onClick={handleSupport}
          />
          <DrawerItem
            icon={
              <FaCog className="transition-transform group-hover:rotate-90" />
            }
            text={`${t("SETTINGS_BUTTON", {
              ns: "drawer",
            })}`}
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
  extends Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "target"
  > {
  icon: React.ReactNode;
  text: string;
  border?: boolean;
  onClick?: () => any;
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
          `${className || ""}`
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
  signIn: () => void;
  signOut: () => void;
}> = ({ signIn, signOut, session }) => {
  const [t] = useTranslation();
  const icon = session?.user ? <FaSignOutAlt /> : <FaSignInAlt />;
  const text = session?.user
    ? `${t("SIGN_OUT", { ns: "drawer" })}`
    : `${t("SIGN_IN", { ns: "drawer" })}`;
  const onClick = session?.user ? signOut : signIn;

  return <DrawerItem icon={icon} text={text} onClick={onClick} />;
};

const ProItem: React.FC<{
  session: Session | null;
  sub: () => any;
  manage: () => any;
}> = ({ sub, manage, session }) => {
  const [t] = useTranslation();
  const text = session?.user?.subscriptionId
    ? `${t("ACCOUNT", { ns: "drawer" })}`
    : `${t("GO_PRO", { ns: "drawer" })}`;
  let icon = session?.user ? <FaUser /> : <FaRocket />;
  if (session?.user?.image) {
    icon = (
      <img
        src={session?.user.image}
        className="h-6 w-6 rounded-full"
        alt="User Image"
      />
    );
  }

  return (
    <DrawerItem
      icon={icon}
      text={text}
      onClick={async () => {
        if (!session?.user) {
          void (await signIn());
        }

        if (session?.user.subscriptionId) {
          void manage();
        } else {
          void sub();
        }
      }}
    />
  );
};

export default Drawer;
