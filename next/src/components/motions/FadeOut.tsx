import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  exitY?: number;
  exitX?: number;
}

const FadeOut = (props: MotionProps) => (
  <motion.div
    exit={{ opacity: 0, x: props.exitX ?? -100, y: props.exitY ?? 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, type: "spring", delay: props.delay ?? 0 }}
    {...props}
  >
    {props.children}
  </motion.div>
);

FadeOut.displayName = "FadeOut";
export default FadeOut;
