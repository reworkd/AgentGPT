import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React, { memo } from "react";
import { FaCircle } from "react-icons/fa";
import type { HandleType, Position } from "reactflow";
import { Handle } from "reactflow";

import type { NodeBlockDefinition } from "../../../services/workflow/node-block-definitions";

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
      !props.status && "border border-white/20",
      "border-translucent w-[17em]  rounded-md p-3 text-white shadow-xl shadow-stone-800 transition-colors duration-300",
      props.selected ? "bg-zinc-800" : "bg-zinc-950 hover:bg-zinc-900",
      props.status === "running" && "border border-amber-500",
      props.status === "success" && "border border-green-500"
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
          "border-gradient !hover:border-white grid !h-fit !w-fit place-items-center !rounded-md !bg-black p-1 text-xs font-light",
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
  if (!definition) return <></>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <FaCircle size={12} />
        <div className="text-xs font-bold text-gray-100">{definition?.name}</div>
      </div>
      <div className="text-md text-sm font-thin">{definition?.description}</div>
    </div>
  );
};
