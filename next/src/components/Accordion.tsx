import { Disclosure as AccordionPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

interface AccordionProps {
  child: React.ReactNode;
  name: string;
}

const Accordion = ({ child, name }: AccordionProps) => {
  return (
    <AccordionPrimitive>
      {({ open }) => (
        <>
          <AccordionPrimitive.Button className="border:black delay-50 background-4 hover:background-color-4 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] focus-visible:ring  md:text-lg">
            {name}
            <FaChevronDown className={`${open ? "rotate-180 transform" : ""} h-5 w-5`} />
          </AccordionPrimitive.Button>
          <AccordionPrimitive.Panel className="background-color-1 rounded-xl p-2">
            {child}
          </AccordionPrimitive.Panel>
        </>
      )}
    </AccordionPrimitive>
  );
};

export default Accordion;
