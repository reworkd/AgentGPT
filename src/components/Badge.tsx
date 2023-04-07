import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <div className="px-3 py-1 h-max text-sm font-semibold text-gray-100 bg-[#1E88E5] rounded-full">
      {children}
    </div>
  );
};

export default Badge;