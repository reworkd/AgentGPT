import clsx from "clsx";
import React from "react";

const ConnectorSection = () => {
  return (
    <div
      className={clsx(
        "h-screen w-screen items-center justify-center overflow-hidden",
        "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
        "from-purple-500/10 from-20% to-transparent to-60%"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mt-20 text-center">
          <h1 className="mb-4 text-6xl font-medium">Integrate with your</h1>
          <h1 className="text-6xl font-semibold">Entire Stack</h1>
        </div>
        <div className="mt-5">
          <h2 className="text-thin">Custom Connectors for every part of your business</h2>
        </div>
      </div>
    </div>
  );
};

export default ConnectorSection;
