import type { PropsWithChildren } from "react";
import React, { memo } from "react";
import type { HandleType, Position } from "reactflow";
import { Handle } from "reactflow";
import clsx from "clsx";

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

function AbstractNode(props: NodeProps) {
  return (
    <div
      className={clsx(
        "border-translucent rounded-md bg-stone-900 p-3 text-white shadow-2xl shadow-stone-800 transition-colors duration-300",
        props.selected ? "border-white" : "hover:border-gray-400",
        props.status === "running" && "border border-amber-500",
        props.status === "success" && "border border-green-500",
        !props.status && "border-gradient"
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
}

export default memo(AbstractNode);
