import React from "react";
import Dialog from "./Dialog";
import { FaCog } from "react-icons/fa";
import { Switch } from "./Switch";
import clsx from "clsx";
import type { ActiveTool } from "../hooks/useTools";
import { useTools } from "../hooks/useTools";

export const ToolsDialog: React.FC<{
  show: boolean;
  close: () => void;
}> = ({ show, close }) => {
  const { tools, isSuccess, setTool } = useTools();

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
            <ToolAvatar tool={tool} />
            <div className="flex flex-grow flex-col gap-1">
              <p className="font-bold capitalize">{tool.name}</p>
              <p className="text-xs sm:text-sm">{tool.description}</p>
            </div>
            <Switch value={tool.active} onChange={() => setTool(tool.name, !tool.active)} />
          </div>
        ))}
        {!isSuccess && <p className="text-center text-red-300">Error loading tools.</p>}
      </div>
    </Dialog>
  );
};

const ToolAvatar = ({ tool }: { tool: ActiveTool }) => {
  return (
    <div className={clsx("h-10 w-10 rounded-full border-[1px] border-white/30 bg-amber-600")} />
  );
};
