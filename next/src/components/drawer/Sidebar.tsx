import Image from "next/image";
import { FaBars } from "react-icons/fa";
import FadingHr from "../FadingHr";
import { DrawerItemButton } from "./DrawerItemButton";
import { PAGE_LINKS, SOCIAL_LINKS } from "../sidebar/links";
import LinkItem from "../sidebar/LinkItem";
import LinkIconItem from "../sidebar/LinkIconItem";
import AuthItem from "../sidebar/AuthItem";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { api } from "../../utils/api";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";

type SidebarProps = {
  show: boolean;
  setShow: (boolean) => void;
};
const Sidebar = ({ show, setShow }: SidebarProps) => {
  const router = useRouter();
  const { session, signIn, signOut, status } = useAuth();
  const [t] = useTranslation("drawer");

  const { isLoading, data } = api.agent.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const userAgents = data ?? [];

  return (
    <SidebarTransition show={show}>
      <nav className="flex flex-1 flex-col bg-neutral-900 px-4 py-3 ring-1 ring-white/10">
        <div className="flex flex-row items-center justify-between">
          <Image src="logo-white.svg" width="25" height="25" alt="Reworkd AI" className="ml-2" />
          <h1 className="font-mono font-extrabold text-gray-200">My Agents</h1>
          <button
            className="hover:background-color-2 rounded-md border border-transparent text-white transition-all hover:border-white/20"
            onClick={() => setShow(!show)}
          >
            <FaBars size="15" className="z-20 m-2" />
          </button>
        </div>
        <FadingHr className="my-2" />
        <div className="-mr-2 mb-2 flex-1 overflow-y-auto">
          {status === "unauthenticated" && (
            <div className="p-1 font-mono text-sm text-white">
              <a className="link" onClick={() => void signIn()}>
                {t("SIGN_IN")}
              </a>{" "}
              {t("SIGN_IN_NOTICE")}
            </div>
          )}
          {status === "authenticated" && !isLoading && userAgents.length === 0 && (
            <div className="p-1 font-mono text-sm text-white">
              {t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST")}
            </div>
          )}
          {userAgents.map((agent, index) => (
            <DrawerItemButton
              key={`${index}-${agent.name}`}
              className="flex w-full rounded-md p-2 font-mono text-sm font-semibold"
              text={agent.name}
              onClick={() => void router.push(`/agent?id=${agent.id}`)}
            />
          ))}
        </div>
        <ul role="list" className="flex flex-col">
          <ul className="mb-2">
            <div className="mb-2 ml-2 text-xs font-semibold text-neutral-400">Pages</div>
            {PAGE_LINKS.map((link) => {
              if (router.route == link.href) {
                return null;
              }

              return (
                <LinkItem
                  key={link.name}
                  title={link.name}
                  icon={link.icon}
                  href={link.href}
                  badge={link.badge}
                  onClick={() => {
                    void router.push(link.href);
                  }}
                />
              );
            })}
          </ul>
          <li className="mb-2">
            <div className="flex items-center justify-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <LinkIconItem
                  key={link.name}
                  icon={link.icon}
                  href={link.href}
                  onClick={() => {
                    void router.push(link.href);
                  }}
                />
              ))}
            </div>
          </li>
          <li>
            <FadingHr />
            <AuthItem session={session} signOut={signOut} signIn={signIn} />
          </li>
        </ul>
      </nav>
    </SidebarTransition>
  );
};

type SidebarTransitionProps = {
  children: ReactNode;
  show: boolean;
};

const SidebarTransition = ({ children, show }: SidebarTransitionProps) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <div className="relative z-30">
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
            <div className="flex h-screen max-h-screen w-64 max-w-xs flex-1">{children}</div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
};

export const SidebarControlButton = ({ show, setShow }: SidebarProps) => {
  return (
    <button
      className="background-color-1 hover:background-color-2 fixed z-20 m-1 rounded-md border border-white/20 text-white transition-all"
      onClick={() => setShow(!show)}
    >
      <FaBars size="15" className="m-2" />
    </button>
  );
};
export default Sidebar;
