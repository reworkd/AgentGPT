import type { ReactNode } from "react";
import { Fragment } from "react";
import { Menu as MenuPrimitive, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";

interface MenuProps {
  icon?: ReactNode;
  name: string;
  variant: "minimal" | "default"
  items: JSX.Element[];
  disabled?: boolean;
  onChange: (value: string) => void;
  styleClass?: { [key: string]: string };
}

function Menu({
  icon,
  name,
  variant = "default",
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
          aria-label={name}
        >
          <div>{icon}</div>
          {variant !== "minimal" && (
            <>
              <p>{name}</p> 
              <FaChevronDown size={15} className="ml-2" />  
            </>
          )}
        </MenuPrimitive.Button>
          <MenuPrimitive.Items className={`${styleClass?.optionsContainer || ""} absolute z-20 mt-1 max-h-48 w-full bg-[#3a3a3a] tracking-wider shadow-xl outline-0`}>
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
