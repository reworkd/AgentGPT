import React from "react";

type TemplateButtonProps = {
  primaryIcon: React.ReactNode;
  secondaryIcon: React.ReactNode;
  title: string;
  description: string;
};

export default function TemplateButton({
  primaryIcon,
  secondaryIcon,
  title,
  description,
}: TemplateButtonProps) {
  return (
    <div className="flex h-fit w-fit flex-row items-center justify-center gap-x-4 rounded-[1000px] border-[0.75px] border-white/50 py-2.5 pl-3 pr-4">
      <div>{primaryIcon}</div>
      <div className="flex flex-col font-inter leading-6 tracking-normal">
        <span className="text-[12px] font-semibold md:text-[15px]">{title}</span>
        <span className="text-[11px] font-medium md:text-[14px]">{description}</span>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-[1000px] bg-white">
        {secondaryIcon}
      </div>
    </div>
  );
}
