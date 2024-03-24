import clsx from "clsx";
import { motion, useMotionTemplate } from "framer-motion";
import React from "react";

import { useMouseMovement } from "../hooks/useMouseMovement";

const colors = {
  blue: "bg-gradient-to-r from-sky-500/30 to-sky-500/20",
  purple: "bg-gradient-to-r from-purple-500/30 to-purple-500/20",
} as const;

interface Props {
  color: keyof typeof colors;
}

const Highlight = (props: Props) => {
  const { mouseX, mouseY, onMouseMove } = useMouseMovement();

  const maskImage = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="absolute inset-0 z-10 h-full w-full" onMouseMove={onMouseMove}>
      <motion.div
        className={clsx(
          "pointer-events-none h-full w-full rounded-xl opacity-0 transition duration-300 group-hover:opacity-100",
          colors[props.color]
        )}
        style={style}
      />
    </div>
  );
};

export default Highlight;
