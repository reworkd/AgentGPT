import React from "react";

interface DottedGridBackgroundProps {
  children: React.ReactNode;
  className?: string
}
const DottedGridBackground = ({ children, className }: DottedGridBackgroundProps) => {
  return (
    <div
      className={`${className ? className + " " : ""} background`}
    >
      {children}
    </div>
  );
};

export default DottedGridBackground;