import React from "react";

interface DottedGridBackgroundProps {
  children: React.ReactNode;
}
const DottedGridBackground = ({ children }: DottedGridBackgroundProps) => {
  return (
    <div
      className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-transparent w-screen h-screen background"
    >
      {children}
    </div>
  );
};

export default DottedGridBackground;