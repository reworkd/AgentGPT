import { motion } from "framer-motion";
import type { MouseEventHandler, PropsWithChildren } from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  duration?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const PopIn = (props: MotionProps) => (
  <motion.div
    exit={{ scale: 0 }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: props.duration ?? 0.3, type: "spring", delay: props.delay ?? 0 }}
    {...props}
    onClick={props.onClick}
  >
    {props.children}
  </motion.div>
);

PopIn.displayName = "PopIn";
export default PopIn;
