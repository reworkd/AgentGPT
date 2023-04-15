import React, { useState } from "react";
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
import { BiPlus } from "react-icons/bi";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";
import type { Session } from "next-auth";
import { env } from "../env/client.mjs";

const Drawer = ({
  showHelp,
  showSettings,
}: {
  showHelp: () => void;
  showSettings: () => void;
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { session, signIn, signOut, status } = useAuth();

  // TODO: enable for crud
  // const [animationParent] = useAutoAnimate();s
  // const query = api.agent.getAll.useQuery(undefined, {
  //   enabled:
  //     status == "authenticated" && env.NEXT_PUBLIC_VERCEL_ENV != "production",
  // });
  // const router = useRouter();
  //
  const userAgents = [];

  const toggleDrawer = () => {
    setShowDrawer((prevState) => !prevState);
  };

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
          "absolute",
          "flex md:static md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="mb-2 flex justify-center gap-2">
            <DrawerItem
              className="flex-grow"
              icon={<BiPlus />}
              border
              text="New Agent"
              onClick={() => location.reload()}
            />
            <button
              className="z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
              onClick={toggleDrawer}
            >
              <FaBars />
            </button>
          </div>
          {/*{TODO: enable for crud}*/}
          <ul>
            {/*  {userAgents.map((agent, index) => (*/}
            {/*    <DrawerItem*/}
            {/*      key={index}*/}
            {/*      icon={<FaRobot />}*/}
            {/*      text={agent.name}*/}
            {/*      className={""}*/}
            {/*      onClick={() => void router.push(`/agent/${agent.id}`)}*/}
            {/*    />*/}
            {/*  ))}*/}

            {userAgents.length === 0 && (
              <div>
                Click the above button to restart. In the future, this will be a
                list of your deployed agents!
              </div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <hr className="my-5 border-white/20" />
          {/*<DrawerItem*/}
          {/*  icon={<FaTrashAlt />}*/}
          {/*  text="Clear Agents"*/}
          {/*  onClick={() => setAgents([])}*/}
          {/*/>*/}

          {env.NEXT_PUBLIC_FF_AUTH_ENABLED && (
            <AuthItem session={session} signIn={signIn} signOut={signOut} />
          )}

          <DrawerItem
            icon={<FaQuestionCircle />}
            text="Help"
            onClick={showHelp}
          />
          <DrawerItem icon={<FaCog />} text="Settings" onClick={showSettings} />
          <DrawerItem
            icon={<FaDiscord />}
            text="Discord"
            href="https://discord.gg/jdSBAnmdnY"
            target="_blank"
          />
          <DrawerItem
            icon={<FaTwitter />}
            text="Twitter"
            href="https://twitter.com/asimdotshrestha/status/1644883727707959296"
            target="_blank"
          />
          <DrawerItem
            icon={<FaGithub />}
            text="GitHub"
            href="https://github.com/reworkd/AgentGPT"
            target="_blank"
          />
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
  onClick?: () => void;
  className?: string;
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
        <span className="text-md ml-4">{text}</span>
      </a>
    );
  } else {
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
  }
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

export default Drawer;
