import { Menu as MenuPrimitive, Transition } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { FaChevronDown } from "react-icons/fa";

interface MenuProps {
  icon?: ReactNode;
  chevron?: boolean;
  name?: string;
  buttonPosition?: "top" | "bottom";
  items: JSX.Element[];
}

function Menu({ icon, name, items, chevron, buttonPosition = "top" }: MenuProps) {
  return (
    <MenuPrimitive>
      <div className="relative">
        <MenuPrimitive.Button className="flex h-8 items-center gap-1 rounded-lg bg-slate-1 p-2 font-bold shadow-depth-1 hover:bg-slate-3">
          <div>{icon}</div>
          {name && <p className="text-gray/50 font-mono text-sm">{name}</p>}
          {chevron && <FaChevronDown size={15} className="ml-2" />}
        </MenuPrimitive.Button>
        <MenuItems buttonPosition={buttonPosition} items={items} />
      </div>
    </MenuPrimitive>
  );
}

type MenuItemsProps = {
  buttonPosition: "top" | "bottom";
  items: JSX.Element[];
  show?: boolean;
};

export const MenuItems = ({ buttonPosition, items, show }: MenuItemsProps) => {
  return (
    <Transition
      show={show ? true : undefined}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <MenuPrimitive.Items
        className={clsx(
          "background-color-3 absolute right-0 z-20 max-h-48  w-fit min-w-full overflow-hidden rounded-xl shadow-xl",
          buttonPosition === "top" ? "top-full mt-1" : "bottom-full mb-9"
        )}
      >
        {items.map((item, i) => {
          return (
            <MenuPrimitive.Item key={i} as={Fragment}>
              <div className="w-full">{item}</div>
            </MenuPrimitive.Item>
          );
        })}
      </MenuPrimitive.Items>
    </Transition>
  );
};

export default Menu;
