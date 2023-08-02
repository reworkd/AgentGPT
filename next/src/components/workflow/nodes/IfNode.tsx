import React, { memo } from "react";
import { type NodeProps, Position } from "reactflow";

import AbstractNode, { NodeTitle } from "./AbstractNode";
import { getNodeBlockDefinitions } from "../../../services/workflow/node-block-definitions";
import type { WorkflowNode } from "../../../types/workflow";

function IfNode(props: NodeProps<WorkflowNode>) {
  const { data, selected } = props;
  const definition = getNodeBlockDefinitions().find((d) => d.type === data.block.type);

  return (
    <AbstractNode
      selected={selected}
      status={data.status}
      handles={[
        { position: Position.Top, type: "target" },
        {
          id: "true",
          position: Position.Bottom,
          type: "source",
          text: "True",
          className: "!left-[20%] !-bottom-4 text-white text-[0.5rem] px-1",
        },

        {
          id: "false",
          position: Position.Bottom,
          text: "False",
          className: "!left-[80%] !-bottom-4 text-white text-[0.5rem] px-1",
          type: "source",
        },
      ]}
    >
      <NodeTitle definition={definition} />
    </AbstractNode>
  );
}

export default memo(IfNode);
