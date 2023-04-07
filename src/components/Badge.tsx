import React from "react";

interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <div className="text-md h-max rounded-full bg-[#1E88E5] px-3 py-1 font-semibold text-gray-100 transition-all hover:scale-110">
      {children}
    </div>
  );
};

export default Badge;
