import type { ReactNode } from "react";
import { Fragment } from "react";
import { Menu as MenuPrimitive, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

interface MenuProps {
  icon?: ReactNode;
  chevron?: boolean;
  name: string;
  items: JSX.Element[];
  variant?: "minimal" | "default";
  styleClass?: { [key: string]: string };
}

function Menu({ icon, name, items, chevron, variant = "default", styleClass }: MenuProps) {
  return (
    <MenuPrimitive>
      <div className="relative">
        <MenuPrimitive.Button
          className="flex h-8 items-center gap-1 rounded-lg border-[1px] border-white/30 bg-[#3a3a3a] p-2 font-bold hover:border-[#1E88E5]/40 hover:bg-[#6b6b6b]"
          aria-label={name}
        >
          <div>{icon}</div>
          {variant !== "minimal" && (
            <>
              <p className="text-gray/50 font-mono text-sm">{name}</p>
              {chevron && <FaChevronDown size={15} className="ml-2" />}
            </>
          )}
        </MenuPrimitive.Button>
        <MenuPrimitive.Items
          className={`${
            styleClass?.optionsContainer || ""
          } absolute right-0 top-full z-20 mt-1 max-h-48 w-fit overflow-hidden rounded-xl border-[2px] border-white/10 bg-[#3a3a3a] tracking-wider shadow-xl outline-0`}
        >
          {items.map((item) => {
            const itemName = (item.props as { name: string }).name;
            return (
              <MenuPrimitive.Item key={itemName} as={Fragment}>
                <div className="w-full py-[1px] md:py-0.5">{item}</div>
              </MenuPrimitive.Item>
            );
          })}
        </MenuPrimitive.Items>
      </div>
    </MenuPrimitive>
  );
}

export default Menu;
