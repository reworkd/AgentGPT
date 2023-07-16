import { Disclosure } from "@headlessui/react";
import { FaBars, FaChevronRight, FaQuestion } from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import clsx from "clsx";
import Image from "next/image";
import HomeIcon from "../../public/icons/home-default-regular.svg";
import BarcodeIcon from "../../public/icons/barcode-default-regular.svg";
import DocumentIcon from "../../public/icons/document-default-regular.svg";
import LocationPinIcon from "../../public/icons/locationpin-default-regular.svg";
import MegaphoneIcon from "../../public/icons/megaphone-default-regular.svg";
import { useRouter } from "next/router";
import TextButton from "./TextButton";
import PrimaryButton from "./PrimaryButton";
import CycleItems from "./motions/CycleItems";
import React from "react";

const HOME = "Home";
const BLOG = "Blog";
const PRICING = "Pricing";
const ROADMAP = "Roadmap";
const DOCS = "Docs";

const navigation = [
  { name: HOME, href: "#" },
  { name: BLOG, href: "https://twitter.com/ReworkdAI" },
  { name: PRICING, href: "https://agentgpt.reworkd.ai/plan" },
  { name: ROADMAP, href: "https://github.com/orgs/reworkd/projects/3" },
  { name: DOCS, href: "https://docs.reworkd.ai/" },
];

const itemMap = {
  [HOME]: <HomeIcon />,
  [BLOG]: <MegaphoneIcon />,
  [PRICING]: <BarcodeIcon />,
  [ROADMAP]: <LocationPinIcon />,
  [DOCS]: <DocumentIcon />,
};

export default function NavBar() {
  const router = useRouter();
  const [selectedLink, setSelectedLink] = React.useState(HOME);

  return (
    <FadeIn duration={3}>
      <Disclosure as="nav" className="z-50 w-full bg-transparent text-white">
        {({ open }) => (
          <>
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
                <div className="flex h-[28px] w-[28px] flex-row justify-start gap-x-4  rounded-full bg-white p-1.5">
                  <CycleItems selectedItem={selectedLink} itemMap={itemMap} />
                </div>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "font-inter text-sm font-medium tracking-normal text-white/50 hover:text-white",
                      "inline-flex items-center p-2",
                      "transition-colors duration-300"
                    )}
                    onMouseEnter={() => setSelectedLink(item.name)}
                    onMouseLeave={() => setSelectedLink(HOME)}
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
                    sad
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
