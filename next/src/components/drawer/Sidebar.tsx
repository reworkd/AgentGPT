import { FaBars } from "react-icons/fa";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

export type DisplayProps = {
  show: boolean;
  setShow: (boolean) => void;
};

export type SidebarProps = DisplayProps & {
  children: ReactNode;
  side: "left" | "right";
};

const Sidebar = ({ show, children, side }: SidebarProps) => {
  return (
    <SidebarTransition show={show} side={side}>
      <nav className="background-color-1 flex flex-1 flex-col px-2.5 py-2 ring-1 ring-white/10">
        {children}
      </nav>
    </SidebarTransition>
  );
};

type SidebarTransitionProps = {
  side: "left" | "right";
  children: ReactNode;
  show: boolean;
};

const SidebarTransition = ({ children, show, side }: SidebarTransitionProps) => {
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
        <div className={`fixed ${side}-0 flex`}>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom={side === "left" ? "-translate-x-full" : "translate-x-full"}
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo={side === "left" ? "-translate-x-full" : "translate-x-full"}
          >
            <div className="flex h-screen max-h-screen w-64 max-w-xs flex-1">{children}</div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
};

export const SidebarControlButton = ({
  show,
  setShow,
  side,
}: DisplayProps & { side: "left" | "right" }) => {
  return (
    <button
      className={clsx(
        "neutral-button-primary fixed z-20 m-1 rounded-md border border-shade-300-light transition-all sm:m-2",
        side === "right" && "right-0"
      )}
      onClick={() => setShow(!show)}
    >
      <FaBars size="15" className="m-2" />
    </button>
  );
};
export default Sidebar;
