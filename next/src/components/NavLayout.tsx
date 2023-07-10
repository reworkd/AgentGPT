import type { ReactNode } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { FaBars, FaQuestion } from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import clsx from "clsx";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Pricing", href: "https://agentgpt.reworkd.ai/plan" },
  { name: "Roadmap", href: "https://github.com/orgs/reworkd/projects/3" },
  { name: "Docs", href: "https://docs.reworkd.ai/" },
];

export default function NavLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FadeIn duration={3}>
        <Disclosure as="nav" className="absolute top-0 z-50 w-full bg-transparent text-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-screen-xl px-6">
                <div className="align-center flex h-16 flex-row justify-between">
                  <div className="flex flex-shrink-0 items-center font-extralight">
                    <Image
                      src="wordmark.svg"
                      width="132"
                      height="20"
                      alt="Reworkd AI"
                      className="mr-2"
                    />
                  </div>
                  <div className="hidden gap-8 sm:-my-px sm:flex">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          "border-transparent text-neutral-200 hover:border-gray-300 hover:text-neutral-50",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                          "font-extralight tracking-wider transition-colors duration-300"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div></div>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <FaQuestion className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <FaBars className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={clsx(
                        "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </FadeIn>

      <main className="min-w-screen min-h-screen">{children}</main>
    </>
  );
}
