import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { type NodeProps, Position } from "reactflow";

import AbstractNode, { NodeTitle } from "./AbstractNode";
import { getNodeBlockDefinitions } from "../../../services/workflow/node-block-definitions";
import WorkflowApi from "../../../services/workflow/workflowApi";
import { useWorkflowStore } from "../../../stores/workflowStore";
import type { WorkflowNode } from "../../../types/workflow";
import Button from "../../../ui/button";

function TriggerNode({ data, selected }: NodeProps<WorkflowNode>) {
  const { data: session } = useSession();
  const workflow = useWorkflowStore().workflow;
  const api = WorkflowApi.fromSession(session);

  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  return (
    <AbstractNode
      selected={selected}
      status={data.status}
      handles={[{ position: Position.Bottom, type: "source" }]}
    >
      <div className="flex flex-col">
        <NodeTitle definition={definition} />
        {workflow?.id && (
          <Button
            onClick={async () => void (await api.execute(workflow?.id))}
            className="mt-2 rounded-md border border-black bg-black text-lg font-extralight tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="text-xs">Run Workflow</span>
          </Button>
        )}
      </div>
    </AbstractNode>
  );
}

export default memo(TriggerNode);
