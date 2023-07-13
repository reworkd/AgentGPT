import React, { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import clsx from "clsx";
import type { WorkflowNode } from "../../types/workflow";

function BasicNode({ data }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={clsx(
        "border-translucent rounded-md bg-white p-3 shadow-xl shadow-gray-300 dark:shadow-2xl dark:shadow-black",
        "dark:bg-stone-900 dark:text-white dark:shadow-stone-800",
        "transition-colors duration-500",
        data.status === "running" && "border-2 border-amber-500",
        data.status === "success" && "border-2 border-green-500",
        !data.status && "border-2 border-gray-500"
      )}
    >
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold dark:text-gray-100">{data.block.type}</div>
          <div className="text-md font-thin">{data.block.description}</div>
        </div>
      </div>

      {/* TODO ENABLE THIS BY BLOCK */}
      <Handle
        type="target"
        position={Position.Top}
        className="bg-black dark:bg-white"
        style={{ width: "0.5em", height: "0.5em" }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-black dark:bg-white"
        style={{ width: "0.5em", height: "0.5em" }}
      />
    </div>
  );
}

export default memo(BasicNode);
