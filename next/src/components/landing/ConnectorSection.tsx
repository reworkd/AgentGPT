import React from "react";
import clsx from "clsx";

const ConnectorSection = () => {
  return (
    <div
      className={clsx(
        "h-screen w-screen items-center justify-center overflow-hidden",
        "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 from-20% to-transparent to-60%"
      )}
    ></div>
  );
};

export default ConnectorSection;
