import { motion, useCycle } from "framer-motion";
import type { PropsWithChildren } from "react";
import React from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
  selected: string;
  itemMap: { [key: string]: React.ReactNode };
}

const CycleItems = (props: MotionProps) => {
  const sequenceMap = {};
  const itemKeys = Object.keys(props.itemMap);

  for (const [index, key] of itemKeys.entries()) {
    if (index === 0) {
      sequenceMap[key] = itemKeys;
      continue;
    }

    const clonedItemKeys = [...itemKeys];
    const firstItem = clonedItemKeys.shift();

    if (firstItem) {
      clonedItemKeys.push(firstItem);
      sequenceMap[key] = clonedItemKeys;
    }
  }

  const [sequenceKey, setSequenceKey] = useCycle(...Object.keys(sequenceMap));

  return (
    <div>
      {sequenceMap[sequenceKey].map((key) => {
        return key === props.selected ? (
          <motion.div className={props.className} layoutId="cycle-items">
            {props.itemMap[key]}
          </motion.div>
        ) : null;
      })}
    </div>
  );
};

CycleItems.displayName = "CycleItems";
export default CycleItems;
