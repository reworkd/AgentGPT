import type { ReactNode } from "react";
import { Fragment } from "react";
import { Menu as MenuPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";

interface MenuProps {
  icon?: ReactNode;
  name: string;
  items: JSX.Element[];
  disabled?: boolean;
  onChange: (value: string) => void;
  styleClass?: { [key: string]: string };
}

function Menu({
  icon,
  name,
  items,
  disabled,
  onChange,
  styleClass,
}: MenuProps) {
  return (
    <MenuPrimitive>
      <div className={styleClass?.container}>
        <MenuPrimitive.Button
          className={clsx(styleClass?.input, "flex items-center gap-1")}
        >
          <div>{icon}</div>
          <p>{name}</p>
          <FaChevronDown size={15} className="ml-2" />
        </MenuPrimitive.Button>
        <MenuPrimitive.Items className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-hidden rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0 transition-all">
          {items.map((item) => {
            const itemName = (item.props as { name: string }).name;
            return (
              <MenuPrimitive.Item key={itemName} as={Fragment}>
                <div className={styleClass?.option}>{item}</div>
              </MenuPrimitive.Item>
            );
          })}
        </MenuPrimitive.Items>
      </div>
    </MenuPrimitive>
  );
}

export default Menu;
