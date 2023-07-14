import type { ReactNode } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { FaBars, FaQuestion, FaChevronRight } from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import clsx from "clsx";
import Image from "next/image";
import HomeIcon from "../../public/icons/home-28x28.svg";
import { useRouter } from "next/router";
import TextButton from "./TextButton";
import PrimaryButton from "./PrimaryButton";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Blog", href: "https://twitter.com/ReworkdAI" },
  { name: "Pricing", href: "https://agentgpt.reworkd.ai/plan" },
  { name: "Roadmap", href: "https://github.com/orgs/reworkd/projects/3" },
  { name: "Docs", href: "https://docs.reworkd.ai/" },
];

export default function NavLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <>
      <FadeIn duration={3}>
        <Disclosure as="nav" className="fixed z-50 w-full bg-transparent text-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-screen-2xl px-6">
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
                  <div className="hidden h-[42px] items-center gap-x-4 self-center rounded-[1000px] border-[1px] border-white/50 px-2 py-1 sm:flex ">
                    <HomeIcon />
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          "font-inter text-sm font-medium tracking-normal text-white/50 hover:text-white",
                          "inline-flex items-center p-2",
                          "transition-colors duration-300"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="hidden sm:flex sm:items-center">
                    <TextButton
                      onClick={() => {
                        router.push("/").catch(console.error);
                      }}
                    >
                      <>
                        <span>AI Agents</span>
                        <FaChevronRight size="12" />
                      </>
                    </TextButton>
                    <PrimaryButton
                      onClick={() => {
                        router.push("/").catch(console.error);
                      }}
                    >
                      <>
                        <span>Contact Us</span>
                        <FaChevronRight size="12" />
                      </>
                    </PrimaryButton>
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
