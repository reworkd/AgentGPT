import React from "react";

interface DottedGridBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const DottedGridBackground = ({
  children,
  className,
}: DottedGridBackgroundProps) => {
  return (
    <div className={`${className ? className + " " : ""} background`}>
      <div className="lower-gradient" />
      {children}
    </div>
  );
};

export default DottedGridBackground;
