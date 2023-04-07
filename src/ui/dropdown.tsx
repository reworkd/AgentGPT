import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import type { ButtonProps } from "./button";
import Button from "./button";

interface DropdownProps extends ButtonProps {
  title?: string | undefined;
  onClick?: () => void;
}

export const Dropdown = (props: DropdownProps) => {
  return (
    <Menu as="div" className="right-0 ml-auto">
      <Menu.Button as={Button} className={props.className} icon={props.icon}>
        <span className="hidden md:flex">{props.title}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-2 z-40 mt-2 w-56 origin-top-right divide-y rounded-lg bg-slate-900 p-1 shadow-sm focus:outline-none">
          <div className="py-1">{props.children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownItem = (props: DropdownProps) => {
  return (
    <Menu.Item>
      <div
        className={`block cursor-pointer justify-between rounded px-3 py-2 text-sm text-white duration-200 hover:text-yellow-500
        ${props.className}`}
        onClick={props.onClick}
      >
        <div className="flex items-center">
          {props.icon && <div className="mr-3">{props.icon}</div>}
          {props.children}
        </div>
      </div>
    </Menu.Item>
  );
};
