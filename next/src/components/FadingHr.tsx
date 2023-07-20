import clsx from "clsx";
import React from "react";

interface FadingHrProps {
  className?: string;
}

const FadingHr: React.FC<FadingHrProps> = ({ className }) => {
  return <div className={clsx(className, "fading-hr dark:fading-hr-dark")}></div>;
};
export default FadingHr;
