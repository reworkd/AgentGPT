import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { type NodeProps, Position } from "reactflow";

import AbstractNode from "./AbstractNode";
import { getNodeBlockDefinitions } from "../../../services/workflow/node-block-definitions";
import WorkflowApi from "../../../services/workflow/workflowApi";
import { useWorkflowStore } from "../../../stores/workflowStore";
import type { WorkflowNode } from "../../../types/workflow";
import PrimaryButton from "../../PrimaryButton";

function TriggerNode({ data, selected }: NodeProps<WorkflowNode>) {
  const { data: session } = useSession();
  const workflow = useWorkflowStore().workflow;
  const api = new WorkflowApi(session?.accessToken);

  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  return (
    <AbstractNode
      selected={selected}
      status={data.status}
      handles={[{ position: Position.Bottom, type: "source" }]}
    >
      <div className="flex flex-col">
        <div className="text-lg font-bold text-gray-100">{definition?.name}</div>
        <div className="text-md text-sm font-thin">{definition?.description}</div>
        {workflow?.id && (
          <PrimaryButton
            onClick={async () => void (await api.execute(workflow?.id))}
            className="mt-2 bg-orange-500 text-lg font-light"
          >
            <span className="text-xs">Execute</span>
          </PrimaryButton>
        )}
      </div>
    </AbstractNode>
  );
}

export default memo(TriggerNode);
