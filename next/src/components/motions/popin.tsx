import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  duration?: number;
}

const PopIn = (props: MotionProps) => (
  <motion.div
    exit={{ scale: 0 }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: props.duration ?? 0.3, type: "spring", delay: props.delay ?? 0 }}
    {...props}
  >
    {props.children}
  </motion.div>
);

PopIn.displayName = "PopIn";
export default PopIn;
