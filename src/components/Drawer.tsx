import React, { useState } from "react";
import {
  FaBars,
  FaCog,
  FaDiscord,
  FaGithub,
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

const Drawer = ({
  showHelp,
  showSettings,
}: {
  showHelp: () => void;
  showSettings: () => void;
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { session, signIn, signOut, status } = useAuth();
  const router = useRouter();

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

  const userAgents = query.data ?? [];

  return (
    <>
      <button
        hidden={showDrawer}
        className="fixed left-2 top-2 z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
        onClick={toggleDrawer}
      >
        <FaBars />
      </button>
      <div
        id="drawer"
        className={clsx(
          showDrawer ? "translate-x-0" : "-translate-x-full",
          "z-30 m-0 h-screen w-72 flex-col justify-between bg-zinc-900 p-3 font-mono text-white shadow-3xl transition-all",
          "fixed top-0 md:sticky",
          "flex md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="mb-2 flex justify-center gap-2">
            My Agent(s)
            <button
              className="z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
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
            ))}

            {status === "unauthenticated" && (
              <div>
                Sign in to be able to save agents and manage your account!
              </div>
            )}
            {status === "authenticated" && userAgents.length === 0 && (
              <div>
                You need to create and save your first agent before anything
                shows up here!
              </div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <hr className="my-5 border-white/20" />
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
            text="Help"
            onClick={showHelp}
          />
          <DrawerItem icon={<FaCog />} text="Settings" onClick={showSettings} />
          <hr className="my-2 border-white/20" />
          <div className="flex flex-row items-center">
            <DrawerItem
              icon={<FaDiscord size={30} />}
              text="Discord"
              href="https://discord.gg/jdSBAnmdnY"
              target="_blank"
              small
            />
            <DrawerItem
              icon={<FaTwitter size={30} />}
              text="Twitter"
              href="https://twitter.com/asimdotshrestha/status/1644883727707959296"
              target="_blank"
              small
            />
            <DrawerItem
              icon={<FaGithub size={30} />}
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
          "flex cursor-pointer flex-row items-center rounded-md rounded-md p-2 hover:bg-white/5",
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
        "flex cursor-pointer flex-row items-center rounded-md rounded-md p-2 hover:bg-white/5",
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
  const icon = session?.user ? <FaSignInAlt /> : <FaSignOutAlt />;
  const text = session?.user ? "Sign Out" : "Sign In";
  const onClick = session?.user ? signOut : signIn;

  return <DrawerItem icon={icon} text={text} onClick={onClick} />;
};

const ProItem: React.FC<{
  session: Session | null;
  sub: () => any;
  manage: () => any;
}> = ({ sub, manage, session }) => {
  const text = session?.user?.subscriptionId ? "Account" : "Go Pro";
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
