import React from "react";

type GlowWrapperProps = {
  children: React.ReactNode;
};

const GlowWrapper = ({ children }: GlowWrapperProps) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute -inset-1 rounded-full bg-[#A02BFE] opacity-50 blur-lg transition-all duration-1000" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowWrapper;
