import { Ring } from "@uiball/loaders";
import type { FC } from "react";

interface LoaderProps {
  className?: string;
  size?: number;
  speed?: number;
  lineWeight?: number;
  color?: string;
}

const Loader: FC<LoaderProps> = ({
  className,
  size = 16,
  speed = 2,
  lineWeight = 7,
  color = "white",
}) => {
  return (
    <div className={className}>
      <Ring size={size} speed={speed} color={color} lineWeight={lineWeight} />
    </div>
  );
};

export default Loader;
