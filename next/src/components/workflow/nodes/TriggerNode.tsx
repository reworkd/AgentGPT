import clsx from "clsx";
import { useSession } from "next-auth/react";
import React, { memo, useState } from "react";
import { type NodeProps, Position } from "reactflow";

import AbstractNode, { NodeTitle } from "./AbstractNode";
import { getNodeBlockDefinitions } from "../../../services/workflow/node-block-definitions";
import WorkflowApi from "../../../services/workflow/workflowApi";
import { useConfigStore } from "../../../stores/configStore";
import { useWorkflowStore } from "../../../stores/workflowStore";
import type { WorkflowNode } from "../../../types/workflow";
import Button from "../../../ui/button";

function TriggerNode({ data, selected }: NodeProps<WorkflowNode>) {
  const { data: session } = useSession();
  const workflow = useWorkflowStore().workflow;
  const { organization: org, setLayout } = useConfigStore();
  const api = new WorkflowApi(session?.accessToken, org?.id);
  const [loading, setLoading] = useState(false);

  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  const handleButtonClick = async () => {
    if (!workflow) return;

    setLoading(true);
    await api.execute(workflow.id);
    setLayout({ showLogSidebar: true });
    setLayout({ showRightSidebar: false });
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Set the duration of the loader in milliseconds (2 seconds in this example)
  };

  return (
    <AbstractNode
      selected={selected}
      status={data.status}
      handles={[{ position: Position.Bottom, type: "source" }]}
    >
      <NodeTitle definition={definition} />
      <Button
        loader={loading}
        onClick={handleButtonClick}
        className={clsx(
          !loading && "hover:bg-white hover:text-black",
          "rounded-md border border-black bg-black text-lg font-extralight tracking-wide text-white transition-all duration-300"
        )}
      >
        <span className="text-xs">Run Workflow</span>
      </Button>
    </AbstractNode>
  );
}

export default memo(TriggerNode);
