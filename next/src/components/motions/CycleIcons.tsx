import { motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

import GlowWrapper from "../GlowWrapper";

interface CycleItemsProps extends PropsWithChildren {
  className?: string;
  currentIndex: number;
  hoveredItemIndex: number;
  icons: ReactNode[];
}

const CycleIcons = (props: CycleItemsProps) => {
  return (
    <GlowWrapper className="opacity-75">
      <div className="flex h-[28px] w-[28px] flex-row justify-start gap-x-4 overflow-hidden rounded-full bg-white p-1.5">
        <motion.div
          className="flex gap-2"
          animate={{
            x: props.hoveredItemIndex ? -24 * props.hoveredItemIndex : -24 * props.currentIndex,
          }}
          transition={{ type: "spring", duration: 0.5, stiffness: 60, damping: 10 }}
        >
          {props.icons.map((item, i) => (
            <motion.div
              key={`cycle-icon-${i}`}
              className={props.className}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </GlowWrapper>
  );
};

export default CycleIcons;
