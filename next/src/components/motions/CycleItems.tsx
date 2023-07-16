import { motion, useCycle } from "framer-motion";
import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
  selectedItem: string;
  itemMap: { [key: string]: React.ReactNode };
}

const CycleItems = (props: MotionProps) => {
  const sequenceMap = {};
  const itemKeys = Object.keys(props.itemMap);
  const clonedItemKeys = [...itemKeys];

  for (const [index, key] of itemKeys.entries()) {
    if (index === 0) {
      sequenceMap[key] = [...clonedItemKeys];
      continue;
    }

    const firstItem = clonedItemKeys.shift();

    if (firstItem) {
      clonedItemKeys.push(firstItem);
      sequenceMap[key] = [...clonedItemKeys];
    }
  }

  const [sequenceKey, setSequenceKey] = useCycle(...itemKeys);

  useEffect(() => {
    if (sequenceKey !== props.selectedItem) {
      setSequenceKey();
    }
  }, [props.selectedItem, sequenceKey]);

  return (
    <>
      {sequenceMap[sequenceKey].map((key) => (
        <motion.div
          className={props.className}
          layoutId="cycle-item"
          key={key}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          {props.itemMap[key]}
        </motion.div>
      ))}
    </>
  );
};

CycleItems.displayName = "CycleItems";
export default CycleItems;
