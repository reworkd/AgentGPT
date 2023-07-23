import React, { memo } from "react";
import { type NodeProps, Position } from "reactflow";

import AbstractNode, { NodeTitle } from "./AbstractNode";
import { getNodeBlockDefinitions } from "../../../services/workflow/node-block-definitions";
import type { WorkflowNode } from "../../../types/workflow";

function BasicNode({ data, selected }: NodeProps<WorkflowNode>) {
  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  return (
    <AbstractNode
      selected={selected}
      status={data.status}
      handles={[
        { position: Position.Top, type: "target" },
        { position: Position.Bottom, type: "source" },
      ]}
    >
      <NodeTitle definition={definition} />
    </AbstractNode>
  );
}

export default memo(BasicNode);
