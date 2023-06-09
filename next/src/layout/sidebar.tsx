import type { FC, PropsWithChildren, ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { useAuth } from "../hooks/useAuth";
import type { Session } from "next-auth";
import { useRouter } from "next/router";
import {
  FaBars,
  FaCog,
  FaDiscord,
  FaGithub,
  FaQuestion,
  FaSignInAlt,
  FaTwitter,
} from "react-icons/fa";
import clsx from "clsx";
import Image from "next/image";
import DottedGridBackground from "../components/DottedGridBackground";
import FadingHr from "../components/FadingHr";
import { DrawerItemButton } from "../components/drawer/DrawerItemButton";
import { api } from "../utils/api";
import { get_avatar } from "../utils/user";
import Dialog from "../ui/dialog";
import { useTranslation } from "next-i18next";
import type { SettingModel } from "../utils/types";
import { SettingsDialog } from "../components/dialog/SettingsDialog";

const links = [
  { name: "Help", href: "https://docs.reworkd.ai/", icon: <FaQuestion /> },
  { name: "Github", href: "https://github.com/reworkd/AgentGPT", icon: <FaGithub /> },
  { name: "Twitter", href: "https://twitter.com/ReworkdAI", icon: <FaTwitter /> },
  { name: "Discord", href: "https://discord.gg/gcmNyAAFfV", icon: <FaDiscord /> },
];

interface Props extends PropsWithChildren {
  settings?: SettingModel;
}

const LinkItem = (props: {
  title: string;
  icon: ReactNode;
  href?: string;
  onClick: () => void;
}) => (
  <li>
    <a
      href={props.href}
      className={clsx(
        "text-neutral-400 hover:bg-neutral-800 hover:text-white",
        "group flex gap-x-3 rounded-md px-2 py-1 text-sm font-semibold leading-6"
      )}
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-[0.625rem] font-medium text-neutral-400 group-hover:text-white">
        {props.icon}
      </span>
      <span className="truncate">{props.title}</span>
    </a>
  </li>
);

const SidebarLayout = (props: Props) => {
  const router = useRouter();
  const { session, signIn, signOut, status } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [t] = useTranslation("drawer");

  const [showSettings, setShowSettings] = useState(false);

  const query = api.agent.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const userAgents = query.data ?? [];

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1280;
      setSidebarOpen(isDesktop);
    };
    handleResize(); // Initial check on open
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <div className="relative z-20">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/80 lg:hidden" />
          </Transition.Child>
          <div className="fixed flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="flex h-screen max-h-screen w-60 max-w-xs flex-1">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <nav className="flex flex-1 flex-col bg-neutral-900 px-2.5 py-2 ring-1 ring-white/10">
                  <div className="flex flex-row items-center justify-between">
                    <Image src="logo-white.svg" width="25" height="25" alt="Reworkd AI" />
                    <h1 className="font-mono font-extrabold text-gray-200">My Agents</h1>
                    <button
                      className="rounded-md border border-transparent text-white transition-all hover:border-white/20 hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      <FaBars size="15" className="z-20 m-2" />
                    </button>
                  </div>
                  <FadingHr className="my-2" />
                  <div className="mb-2 flex-1 overflow-y-auto">
                    {status === "unauthenticated" && (
                      <div className="p-1 font-mono text-sm text-white">
                        <a className="link" onClick={() => void signIn()}>
                          {t("SIGN_IN")}
                        </a>{" "}
                        {t("SIGN_IN_NOTICE")}
                      </div>
                    )}
                    {status === "authenticated" && userAgents.length === 0 && (
                      <div className="p-1 font-mono text-sm text-white">
                        {t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST")}
                      </div>
                    )}
                    {userAgents.map((agent, index) => (
                      <DrawerItemButton
                        key={index}
                        className="flex w-full rounded-md p-2 font-mono text-sm font-semibold"
                        text={agent.name}
                        onClick={() => void router.push(`/agent?id=${agent.id}`)}
                      />
                    ))}
                  </div>
                  <ul role="list" className="flex flex-col">
                    <li className="mb-2">
                      <div className="ml-2 text-xs font-semibold text-neutral-400">
                        Important Links
                      </div>
                      <ul role="list" className="mt-2 space-y-1">
                        <LinkItem
                          title="Settings"
                          icon={<FaCog />}
                          onClick={() => {
                            setShowSettings(true);
                          }}
                        />
                        {links.map((link) => (
                          <LinkItem
                            key={link.name}
                            title={link.name}
                            icon={link.icon}
                            href={link.href}
                            onClick={() => {
                              void router.push(link.href);
                            }}
                          />
                        ))}
                      </ul>
                    </li>
                    <li>
                      <FadingHr />
                      <AuthItem session={session} signOut={signOut} signIn={signIn} />
                    </li>
                  </ul>
                </nav>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Root>
      <button
        className="absolute z-10 m-2 rounded-md border border-white/20 text-white transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars size="15" className="z-20 m-2" />
      </button>

      {props.settings && (
        <SettingsDialog
          customSettings={props.settings}
          show={showSettings}
          close={() => setShowSettings(false)}
        />
      )}

      <main
        className={clsx("bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]", sidebarOpen && "lg:pl-60")}
      >
        <DottedGridBackground className="min-w-screen min-h-screen px-3 py-2">
          <div>{props.children}</div>
        </DottedGridBackground>
      </main>
    </div>
  );
};

const AuthItem: FC<{
  session: Session | null;
  classname?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}> = ({ session, classname, signOut, signIn }) => {
  const [t] = useTranslation("drawer");
  const [showDialog, setShowDialog] = useState(false);
  const user = session?.user;

  return (
    <div
      className={clsx(
        "mt-1.5 flex items-center justify-start gap-3 rounded-md px-2 py-1 text-sm font-semibold text-white hover:bg-neutral-800",
        classname
      )}
      onClick={(e) => {
        user ? setShowDialog(true) : void signIn();
      }}
    >
      {user && (
        <img className="h-8 w-8 rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />
      )}
      {!user && (
        <h1 className="ml-2 flex flex-grow items-center gap-2 text-center">
          <FaSignInAlt />
          {t("SIGN_IN")}
        </h1>
      )}

      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">{user?.name}</span>
      <Dialog
        inline
        open={showDialog}
        setOpen={setShowDialog}
        title="My Account"
        icon={<img className="rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />}
        actions={
          <>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              onClick={() => {
                signOut()
                  .then(() => setShowDialog(false))
                  .catch(console.error)
                  .finally(console.log);
              }}
            >
              Sign out
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">Name: {user?.name}</p>
        <p className="text-sm text-gray-500">Email: {user?.email}</p>
      </Dialog>
    </div>
  );
};

export default SidebarLayout;
