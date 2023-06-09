import React from "react";
import clsx from "clsx";

interface FadingHrProps {
  className?: string;
}

const FadingHr: React.FC<FadingHrProps> = ({ className }) => {
  return <div className={clsx(className, "fading-hr dark:fading-hr-dark")}></div>;
};
export default FadingHr;
