import { FC, Fragment, PropsWithChildren, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HiBars3,
  HiCalendar,
  HiChartPie,
  HiDocument,
  HiFolder,
  HiHome,
  HiUsers,
  HiXMark,
} from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";
import type { User } from "next-auth";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/", icon: HiHome, current: true },
  { name: "Agents", href: "agents", icon: HiUsers, current: false },
  { name: "Settings", href: "#", icon: HiFolder, current: false },
  { name: "Calendar", href: "#", icon: HiCalendar, current: false },
  { name: "Documents", href: "#", icon: HiDocument, current: false },
  { name: "Reports", href: "#", icon: HiChartPie, current: false },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MobileTopBar: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-neutral-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
    <button type="button" className="-m-2.5 p-2.5 text-neutral-400 lg:hidden" onClick={onClick}>
      <span className="sr-only">Open sidebar</span>
      <HiBars3 className="h-6 w-6" aria-hidden="true" />
    </button>
    <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
    <a href="#">
      <span className="sr-only">Your profile</span>
      <img
        className="h-8 w-8 rounded-full bg-neutral-800"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
    </a>
  </div>
);

const SidebarLayout = (props: PropsWithChildren) => {
  const router = useRouter();
  const { session } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-neutral-900/80" />
            </Transition.Child>
            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <HiXMark className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-neutral-800 text-white"
                                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-neutral-400">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-neutral-800 text-white"
                                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
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
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          className={classNames(
                            item.current
                              ? "bg-neutral-800 text-white"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                          onClick={() => void router.push(item.href)}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-neutral-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          className={classNames(
                            team.current
                              ? "bg-neutral-800 text-white"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                          onClick={() => void router.push(team.href)}
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
                <li className="-mx-6 mt-auto">
                  <DesktopProfile user={session?.user} />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <MobileTopBar onClick={() => setSidebarOpen(true)} />

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{props.children}</div>
        </main>
      </div>
    </>
  );
};

const DesktopProfile: FC<{ user?: User }> = ({ user }) => {
  const img =
    user?.image ||
    "https://avatar.vercel.sh/" +
      (user?.email || "") +
      ".svg?text=" +
      (user?.name?.substr(0, 2).toUpperCase() || ""); //TODO: Fix shortname bug

  return (
    <a
      href="#"
      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-neutral-800"
    >
      {user && <img className="h-8 w-8 rounded-full bg-neutral-800" src={img} alt="" />}
      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">{user?.name}</span>
    </a>
  );
};

export default SidebarLayout;
