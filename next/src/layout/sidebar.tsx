import React, { FC, Fragment, PropsWithChildren, useState } from "react";
import { Transition } from "@headlessui/react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import {
  FaBars,
  FaDiscord,
  FaGithub,
  FaLaptop,
  FaRobot,
  FaTwitter,
  FaWrench,
} from "react-icons/fa";
import clsx from "clsx";
import Image from "next/image";
import DottedGridBackground from "../components/DottedGridBackground";
import FadingHr from "../components/FadingHr";
import { DrawerItemButton } from "../components/drawer/DrawerItemButton";
import { api } from "../utils/api";

const navigation = [
  { name: "Console", href: "/", icon: FaLaptop, current: true },
  { name: "Agents", href: "agents", icon: FaRobot, current: false },
  { name: "Settings", href: "#", icon: FaWrench, current: false },
];

const links = [
  { id: 1, name: "Github", href: "#", initial: <FaGithub /> },
  { id: 2, name: "Twitter", href: "#", initial: <FaTwitter /> },
  { id: 3, name: "Discord", href: "#", initial: <FaDiscord /> },
];
const SidebarLayout = (props: PropsWithChildren) => {
  const router = useRouter();
  const { session } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const query = api.agent.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const userAgents = query.data ?? [];

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <div className="relative z-50">
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
              <div className="relative mr-16 flex h-screen max-h-screen w-72 max-w-xs flex-1">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col bg-neutral-900 px-6 pb-2 ring-1 ring-white/10">
                  {/* TODO: align left */}
                  <div className="mt-2 flex h-10 flex-row items-center">
                    <Image
                      className="h-6 -translate-x-2"
                      src="logo-white.svg"
                      width="40"
                      height="40"
                      alt="Reworkd AI"
                    />
                    {/*<h1 className="ml-4 flex-grow font-mono text-xl font-extrabold text-gray-200">*/}
                    {/*  Agent<span className="font-extrabold text-white">GPT</span>*/}
                    {/*</h1>*/}

                    <button
                      className="ml-auto translate-x-4 rounded-md border-2 border-white/20 text-white transition-all"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      <FaBars size="20" className="z-20 m-2" />
                    </button>
                  </div>
                  <FadingHr className="my-3" />
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col">
                      <li className="flex-grow">
                        {/* TODO: fix should fill whole screen */}
                        <ul role="list" className="-mx-2 max-h-[60vh] space-y-1 overflow-y-auto ">
                          {userAgents.map((agent, index) => (
                            <DrawerItemButton
                              key={index}
                              className="flex rounded-md p-2 text-sm font-semibold"
                              icon={<FaRobot />}
                              text={agent.name}
                              onClick={() => void router.push(`/agent?id=${agent.id}`)}
                            />
                          ))}
                        </ul>
                      </li>
                      <li className="mb-2">
                        <div className="text-xs font-semibold leading-6 text-neutral-400">
                          Important Links
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {links.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={clsx(
                                  "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-[0.625rem] font-medium text-neutral-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <FadingHr className="mx-4 mb-2" />
                        <DesktopProfile user={session?.user} />
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Root>

      <button
        className="absolute z-20 m-2 rounded-md border-2 border-white/20 text-white transition-all"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars size="20" className="z-20 m-2" />
      </button>

      <main
        className={clsx("bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]", sidebarOpen && "lg:pl-72")}
      >
        <DottedGridBackground className="min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8">{props.children}</div>
        </DottedGridBackground>
      </main>
    </div>
  );
};

const DesktopProfile: FC<{ user?: User; classname?: string }> = ({ user, classname }) => {
  const img =
    user?.image ||
    "https://avatar.vercel.sh/" +
      (user?.email || "") +
      ".svg?text=" +
      (user?.name?.substr(0, 2).toUpperCase() || ""); //TODO: Fix shortname bug

  return (
    <a
      href="#"
      className={clsx(
        "flex -translate-x-3 items-center justify-start gap-3 rounded-md px-2 py-4 text-sm font-semibold text-white hover:bg-neutral-800",
        classname
      )}
    >
      {user && <img className="h-8 w-8 rounded-full bg-neutral-800" src={img} alt="" />}
      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">{user?.name}</span>
    </a>
  );
};

export default SidebarLayout;
