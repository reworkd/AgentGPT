import React from "react";

interface DrawerUrlButtonProps {
  icon: React.ReactNode;
  href: string;
}

export const DrawerUrlButton = (props: DrawerUrlButtonProps) => {
  const { icon, href } = props;

  return (
    <a
      className="group flex cursor-pointer flex-row items-center rounded-md p-2 hover:bg-white/5"
      href={href}
      target={"_blank"}
    >
      {icon}
    </a>
  );
};
