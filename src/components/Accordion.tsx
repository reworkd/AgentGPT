import { Disclosure as AccordionPrimitive } from "@headlessui/react";

interface AccordionProps {
  child: React.ReactNode;
  name: string;
}

const Accordion = ({ child, name }: AccordionProps) => {
  return (
    <AccordionPrimitive>
      <AccordionPrimitive.Button className="border:black delay-50 mb-1 w-full rounded-xl bg-[#4a4a4a] bg-transparent px-2 py-2 text-sm tracking-wider outline-0 transition-all placeholder:text-white/20 hover:border-[#1E88E5]/40 focus:border-[#1E88E5] sm:py-3 md:mb-3 md:text-lg">
        {name}
      </AccordionPrimitive.Button>
      <AccordionPrimitive.Panel>{child}</AccordionPrimitive.Panel>
    </AccordionPrimitive>
  );
};

export default Accordion;
