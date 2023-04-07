import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface MotionProps extends PropsWithChildren {
  className?: string;
}

const PopIn = (props: MotionProps) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
    {...props}
  >
    {props.children}
  </motion.div>
);

PopIn.displayName = "PopIn";
export default PopIn;
