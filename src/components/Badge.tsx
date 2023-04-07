import React from "react";

interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <div className="text-md h-max rounded-full bg-[#1E88E5] px-5 py-2 font-semibold text-gray-100">
      {children}
    </div>
  );
};

export default Badge;
