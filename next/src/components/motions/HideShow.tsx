import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface MotionProps extends PropsWithChildren {
  showComponent: boolean;
  className?: string;
}

const HideShow = (props: MotionProps) => {
  const { showComponent, ...rest } = props;
  return (
    <motion.span
      animate={showComponent ? "show" : "hide"}
      variants={{
        show: { opacity: 1, visibility: "visible" },
        hide: { opacity: 0, visibility: "hidden" },
      }}
      {...rest}
    >
      {props.children}
    </motion.span>
  );
};

HideShow.displayName = "HideShow";
export default HideShow;
