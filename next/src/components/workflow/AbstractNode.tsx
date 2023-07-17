import type { PropsWithChildren } from "react";
import React, { memo } from "react";
import type { HandleType, Position } from "reactflow";
import { Handle } from "reactflow";
import clsx from "clsx";

interface NodeProps extends PropsWithChildren {
  handles: [Position, HandleType][];
  selected: boolean;
  status?: string;
}

function AbstractNode(props: NodeProps) {
  return (
    <div
      className={clsx(
        "border-translucent rounded-md p-3 shadow-2xl shadow-black",
        "bg-stone-900 text-white shadow-stone-800",
        "transition-colors duration-300",
        props.selected ? "border-white" : "hover:border-gray-400",
        props.status === "running" && "border border-amber-500",
        props.status === "success" && "border border-green-500",
        !props.status && "border-gradient"
      )}
    >
      {props.children}
      {props.handles.map(([position, type]) => (
        <Handle
          key={position}
          type={type}
          position={position}
          className="bg-black"
          style={{ width: "0.5em", height: "0.5em" }}
        />
      ))}
    </div>
  );
}

export default memo(AbstractNode);
