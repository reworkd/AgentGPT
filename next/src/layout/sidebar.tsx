import type { PropsWithChildren } from "react";
import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";
import clsx from "clsx";
import Image from "next/image";
import DottedGridBackground from "../components/DottedGridBackground";
import FadingHr from "../components/FadingHr";
import { DrawerItemButton } from "../components/drawer/DrawerItemButton";
import { api } from "../utils/api";
import { useTranslation } from "next-i18next";
import AppHead from "../components/AppHead";
import LinkItem from "../components/sidebar/LinkItem";
import AuthItem from "../components/sidebar/AuthItem";
import { PAGE_LINKS, SOCIAL_LINKS } from "../components/sidebar/links";

const SidebarLayout = (props: PropsWithChildren) => {
  const router = useRouter();
  const { session, signIn, signOut, status } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [t] = useTranslation("drawer");

  const { isLoading, data } = api.agent.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const userAgents = data ?? [];

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
    <>
      <AppHead />
      <Transition.Root show={sidebarOpen} as={Fragment}>
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
              <div className="flex h-screen max-h-screen w-60 max-w-xs flex-1">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <nav className="flex flex-1 flex-col bg-neutral-900 px-2.5 py-2 ring-1 ring-white/10">
                  <div className="flex flex-row items-center justify-between">
                    <Image
                      src="logo-white.svg"
                      width="25"
                      height="25"
                      alt="Reworkd AI"
                      className="ml-2"
                    />
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
                            onClick={() => {
                              void router.push(link.href);
                            }}
                          />
                        );
                      })}
                    </ul>
                    <li className="mb-2">
                      <div className="ml-2 text-xs font-semibold text-neutral-400">Socials</div>
                      <ul role="list" className="mt-2 space-y-1">
                        {SOCIAL_LINKS.map((link) => (
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
        className={clsx(
          sidebarOpen && "hidden",
          "fixed z-20 m-2 rounded-md border border-white/20 text-white transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600"
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars size="15" className="z-20 m-2" />
      </button>

      <main
        className={clsx(
          "bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F] duration-300",
          sidebarOpen && "lg:pl-60"
        )}
      >
        <DottedGridBackground className="min-w-screen min-h-screen">
          {props.children}
        </DottedGridBackground>
      </main>
    </>
  );
};

export default SidebarLayout;
