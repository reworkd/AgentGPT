import React, { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import clsx from "clsx";
import type { WorkflowNode } from "../../types/workflow";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";

function BasicNode({ data }: NodeProps<WorkflowNode>) {
  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  return (
    <div
      className={clsx(
        "border-translucent rounded-md p-3 shadow-2xl shadow-black",
        "bg-stone-900 text-white shadow-stone-800",
        "transition-colors duration-500",
        data.status === "running" && "border border-amber-500",
        data.status === "success" && "border border-green-500",
        !data.status && "border border-gray-500"
      )}
    >
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-100">{definition?.name}</div>
          <div className="text-md text-sm font-thin">{definition?.description}</div>
        </div>
      </div>

      {/* TODO ENABLE THIS BY BLOCK */}
      <Handle
        type="target"
        position={Position.Top}
        className="bg-black"
        style={{ width: "0.5em", height: "0.5em" }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-black"
        style={{ width: "0.5em", height: "0.5em" }}
      />
    </div>
  );
}

export default memo(BasicNode);
