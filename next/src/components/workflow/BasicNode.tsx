import React, { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import clsx from "clsx";
import type { WorkflowNode } from "../../types/workflow";

function BasicNode({ data }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={clsx(
        "border-translucent rounded-md bg-white p-3 shadow-xl shadow-gray-300 dark:border-neutral-900 dark:shadow-2xl dark:shadow-black",
        "dark:bg-stone-900 dark:text-white dark:shadow-stone-800"
      )}
    >
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold dark:text-gray-100">{data.ref.substr(0, 4)}</div>
        </div>
      </div>

      {/* TODO ENABLE THIS BY BLOCK */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-black dark:bg-white"
        style={{ width: "0.5em", height: "0.5em" }}
      />

      <Handle
        type="source"
        position={Position.Right}
        className="bg-black dark:bg-white"
        style={{ width: "0.5em", height: "0.5em" }}
      />
    </div>
  );
}

export default memo(BasicNode);
