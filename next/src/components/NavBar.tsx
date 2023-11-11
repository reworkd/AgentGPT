import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaBars, FaChevronRight, FaTimes } from "react-icons/fa";

import GlowWrapper from "./GlowWrapper";
import CycleIcons from "./motions/CycleIcons";
import FadeIn from "./motions/FadeIn";
import PrimaryButton from "./PrimaryButton";
import TextButton from "./TextButton";
import BlogsIcon from "../../public/icons/icon-blogs.svg";
import DocsIcon from "../../public/icons/icon-docs.svg";
import GithubIcon from "../../public/icons/icon-github.svg";
import HomeIcon from "../../public/icons/icon-home.svg";
import PricingIcon from "../../public/icons/icon-pricing.svg";

const navigation = [
  { name: "Home", href: "/home", icon: <HomeIcon /> },
  { name: "Blog", href: "/blog", icon: <BlogsIcon /> },
  { name: "Pricing", href: "https://agentgpt.reworkd.ai/plan", icon: <PricingIcon /> },
  {
    name: "Github",
    href: "https://github.com/reworkd/AgentGPT",
    icon: <GithubIcon />,
  },
  { name: "Docs", href: "https://docs.reworkd.ai/", icon: <DocsIcon /> },
];

export default function NavBar() {
  const router = useRouter();
  const currentIndex = navigation.findIndex(
    (nav) => router.pathname.includes(nav.href) || router.pathname === nav.href
  );
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(0);

  return (
    <FadeIn duration={3}>
      <Disclosure as="nav" className="z-50 w-full bg-transparent text-white">
        {({ open }) => (
          <>
            <div className="align-center flex h-16 flex-row justify-between">
              <div className="flex flex-shrink-0 cursor-pointer items-center lg:flex-1">
                <Image
                  src="/logos/dark-default-solid.svg"
                  width="25"
                  height="25"
                  alt="Reworkd AI"
                  className="mb-1 mr-2 invert-0"
                />
                <span className="text-xl font-light tracking-wider">Reworkd</span>
              </div>
              <div className="hidden flex-1 items-center justify-center xmd:flex">
                <div className="border-gradient flex h-[42px] items-center self-center overflow-hidden rounded-full bg-opacity-5 px-2 py-1 backdrop-blur-lg">
                  <CycleIcons
                    currentIndex={currentIndex}
                    hoveredItemIndex={hoveredButtonIndex}
                    icons={navigation.map((nav) => nav.icon)}
                  />
                  {navigation.map((item, i) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        "after-gradient relative flex flex-col items-center justify-center p-2 px-4 text-center font-inter text-sm tracking-normal text-white transition-colors duration-700 before:absolute before:-bottom-[20px] before:-z-20 before:h-6 before:w-12 before:bg-white/60 before:blur-lg before:transition-opacity before:duration-700 after:absolute after:-bottom-[2.25px] after:h-[1px] after:w-16 after:px-2 after:transition-opacity after:duration-700 hover:text-white",
                        currentIndex !== i && "text-white/50 before:opacity-0 after:opacity-0"
                      )}
                      onMouseEnter={() => setHoveredButtonIndex(i)}
                      onMouseLeave={() => setHoveredButtonIndex(0)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden justify-end gap-2 xmd:flex sm:items-center lg:flex-1">
                <GlowWrapper className="opacity-40">
                  <PrimaryButton
                    onClick={() => {
                      window.open("https://6h6bquxo5g1.typeform.com/to/qscfsOf1", "_blank");
                    }}
                  >
                    <>
                      <span>Join the Waitlist</span>
                      <FaChevronRight
                        size="12"
                        className="text-gray-700 transition-transform group-hover:translate-x-1"
                      />
                    </>
                  </PrimaryButton>
                </GlowWrapper>
              </div>
              <div className="-mr-2 flex items-center xmd:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <FaTimes className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FaBars className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

            <Disclosure.Panel className="xmd:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
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
  );
}
