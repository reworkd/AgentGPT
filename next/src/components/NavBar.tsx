import { Disclosure } from "@headlessui/react";
import { FaBars, FaChevronRight, FaQuestion } from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import HomeIcon from "../../public/icons/home-default-regular.svg";
import BarcodeIcon from "../../public/icons/barcode-default-regular.svg";
import DocumentIcon from "../../public/icons/document-default-regular.svg";
import LocationPinIcon from "../../public/icons/locationpin-default-regular.svg";
import TextButton from "./TextButton";
import PrimaryButton from "./PrimaryButton";
import CycleIcons from "./motions/CycleIcons";
import React from "react";
import MegaphoneIcon from "../../public/icons/megaphone-default-regular.svg";
import GlowWrapper from "./GlowWrapper";

const navigation = [
  { name: "Home", href: "/", icon: <HomeIcon /> },
  { name: "Blog", href: "https://twitter.com/ReworkdAI", icon: <MegaphoneIcon /> },
  { name: "Pricing", href: "https://agentgpt.reworkd.ai/plan", icon: <BarcodeIcon /> },
  {
    name: "Roadmap",
    href: "https://github.com/orgs/reworkd/projects/3",
    icon: <LocationPinIcon />,
  },
  { name: "Docs", href: "https://docs.reworkd.ai/", icon: <DocumentIcon /> },
];

export default function NavBar() {
  const router = useRouter();
  const [hoveredButtonIndex, setHoveredButtonIndex] = React.useState(0);

  return (
    <FadeIn duration={3}>
      <Disclosure as="nav" className="z-50 w-full bg-transparent text-white">
        {({ open }) => (
          <>
            <div className="align-center flex h-16 flex-row justify-between">
              <div className="flex flex-shrink-0 items-center">
                <Image
                  src="/logos/dark-default-gradient.svg"
                  width="32"
                  height="32"
                  alt="Reworkd AI"
                  className="mr-2"
                />
                <span className="text-xl font-extralight tracking-wider">Reworkd</span>
              </div>
              <div className="hidden h-[42px] items-center self-center overflow-hidden rounded-full border-[0.5px] border-white/30 bg-neutral-100 bg-opacity-5 px-2 py-1 backdrop-blur-lg sm:flex">
                <CycleIcons
                  hoveredItemIndex={hoveredButtonIndex}
                  icons={navigation.map((nav) => nav.icon)}
                />
                {navigation.map((item, i) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "font-inter text-sm tracking-normal text-white/50 hover:text-white",
                      "flex items-center justify-center p-2",
                      "px-4 text-center transition-colors duration-700",
                      "relative flex flex-col items-center",
                      "before:absolute before:-bottom-[17px] before:-z-20 before:h-6 before:w-7 before:bg-white/60 before:opacity-0 before:blur-lg before:transition-opacity before:duration-700 hover:before:opacity-100",
                      "after-gradient after:absolute after:-bottom-[2.5px] after:h-[1px] after:w-14 after:px-2 after:opacity-0 after:transition-opacity after:duration-700 hover:after:opacity-100"
                    )}
                    onMouseEnter={() => setHoveredButtonIndex(i)}
                    onMouseLeave={() => setHoveredButtonIndex(0)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden gap-2 sm:flex sm:items-center">
                <TextButton
                  onClick={() => {
                    router.push("/").catch(console.error);
                  }}
                >
                  <>
                    <span>AI Agents</span>
                    <FaChevronRight
                      size="12"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                </TextButton>
                <GlowWrapper>
                  <PrimaryButton
                    onClick={() => {
                      router.push("/").catch(console.error);
                    }}
                  >
                    <>
                      <span>Contact Us</span>
                      <FaChevronRight
                        size="12"
                        className="text-gray-400 transition-transform group-hover:translate-x-1"
                      />
                    </>
                  </PrimaryButton>
                </GlowWrapper>
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
  );
}
