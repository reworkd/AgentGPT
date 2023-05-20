import React from "react";
import Dialog from "./Dialog";
import { FaCog } from "react-icons/fa";
import { Switch } from "./Switch";
import clsx from "clsx";

interface Tool {
  name: string;
  description: string;
  color: string;
}

const tools: Tool[] = [
  {
    name: "Search",
    description: "Search google for information about current events",
    color: "bg-blue-400",
  },
  {
    name: "Wikipedia",
    description: "Search wikipedia for historal information",
    color: "bg-zinc-600",
  },
  {
    name: "Image generation",
    description: "Use DallE to generate images based on text input",
    color: "bg-green-400",
  },
];

export const ToolsDialog: React.FC<{
  show: boolean;
  close: () => void;
}> = ({ show, close }) => {
  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <p>Tools</p>
          <FaCog />
        </div>
      }
      isShown={show}
      close={close}
    >
      <p>Select what external tools your agents have access to.</p>
      <div className="mt-5 flex flex-col gap-3 ">
        {tools.map((tool) => (
          <div
            key={tool.name + tool.description}
            className="flex items-center gap-3 rounded-md border-[1px] border-white/30 bg-zinc-800 p-2 px-4 text-white"
          >
            <div
              className={clsx("h-10 w-10 rounded-full border-[1px] border-white/30", tool.color)}
            />
            <div className="flex flex-grow flex-col gap-1">
              <p className="font-bold">{tool.name}</p>
              <p className="text-sm">{tool.description}</p>
            </div>
            <Switch value={true} onChange={() => null} />
          </div>
        ))}
      </div>
    </Dialog>
  );
};
