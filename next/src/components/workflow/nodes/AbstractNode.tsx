import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React, { memo } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import type { HandleType, Position } from "reactflow";
import { Handle } from "reactflow";

import type { NodeBlockDefinition } from "../../../services/workflow/node-block-definitions";
import { useConfigStore } from "../../../stores/configStore";

interface Handle {
  position: Position;
  type: HandleType;
  className?: string;
  id?: string;
  text?: string;
}

interface NodeProps extends PropsWithChildren {
  handles: Handle[];
  selected: boolean;
  status?: string;
}

const AbstractNode = (props: NodeProps) => (
  <div
    className={clsx(
      "w-[17em] rounded-md border border-black bg-white p-3 shadow shadow-stone-800 transition-colors duration-300",
      props.status === "running" && "ring ring-amber-500/50",
      props.status === "success" && "ring ring-green-500/50",
      props.status === "error" && "ring ring-red-500/50"
    )}
  >
    {props.children}
    {props.handles.map(({ position, type, text, className, id }, i) => (
      <Handle
        key={`${i}-${id || ""}`}
        {...(id ? { id } : {})} /* Only specify id if provided */
        type={type}
        position={position}
        className={clsx(
          "border-gradient !hover:border-white grid !h-fit !w-fit place-items-center !rounded-md !border-2 !border-white !bg-black p-0.5 text-xs font-light shadow-xl ring-1 ring-black",
          className
        )}
      >
        {text}
      </Handle>
    ))}
  </div>
);

export default memo(AbstractNode);

export const NodeTitle = ({ definition }: { definition?: NodeBlockDefinition }) => {
  const setLayout = useConfigStore().setLayout;
  if (!definition) return <></>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <definition.icon size={12} />
        <div className="flex-grow text-xs">{definition?.name}</div>
        <button
          className="rounded-full p-0.5 transition-colors hover:bg-gray-50"
          onClick={() => {
            setLayout({
              showRightSidebar: true,
            });
          }}
        >
          <HiEllipsisHorizontal size={12} />
        </button>
      </div>
      <div className="text-[8pt] font-light tracking-tight">{definition?.description}</div>
    </div>
  );
};
