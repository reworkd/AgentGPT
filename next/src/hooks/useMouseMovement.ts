import { useMotionValue } from "framer-motion";
import type { MouseEvent } from "react";

export function useMouseMovement() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return {
    mouseX,
    mouseY,
    onMouseMove,
  };
}
