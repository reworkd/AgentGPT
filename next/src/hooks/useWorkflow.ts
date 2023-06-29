import type { ActionBlock, EdgesModel, NodesModel, WorkflowNode } from "../types/flowchart";
import type { Edge, Node } from "reactflow";
import { useState } from "react";
import { nanoid } from "nanoid";

export const useWorkflow = (id: string) => {
  // const { mutateAsync: upsertWorkflow } = trpc.workflow.save.useMutation();

  const nodesModel: NodesModel = useState<Node<Partial<WorkflowNode>>[]>([
    {
      id: "1",
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        id: "1",
        ref: "1",
        actionBlock: {
          id: "1",
          name: "Test",
          // description: "Test",
          // code: "Test",
          hasOutput: true,
          hasInput: false,
        },
      },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 100, y: 0 },
      data: {
        id: "1",
        ref: "1",
        actionBlock: {
          id: "1",
          name: "Test",
          // description: "Test",
          // code: "Test",
          hasOutput: true,
          hasInput: true,
        },
      },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 0, y: 100 },
      data: {
        id: "1",
        ref: "1",
        actionBlock: {
          id: "1",
          name: "Test",
          // description: "Test",
          // code: "Test",
          hasOutput: false,
          hasInput: true,
        },
      },
    },
  ]);
  const edgesModel: EdgesModel = useState<Edge[]>([]);

  // const { isLoading, data } = trpc.workflow.get.useQuery(id, {
  //   enabled: !!id,
  //   onSuccess: (data) => {
  //     if (!data) return;
  //
  //     nodesModel[1](data.nodes.map(toReactFlowPartial));
  //     edgesModel[1](data.edges);
  //   },
  // });

  const createNode = (block: ActionBlock) => {
    const ref = nanoid(8);

    nodesModel[1]((nodes) => [
      ...(nodes ?? []),
      {
        id: ref,
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          id: ref,
          ref: ref,
          actionBlock: block,
          posX: 0,
          posY: 0,
        },
      },
    ]);
  };

  const onSave = async () => {
    // return await upsertWorkflow({
    //   id: data?.id,
    //   name: "Unnamed Workflow",
    //   nodes: nodesModel[0].map(toPrisma),
    //   edges: edgesModel[0] as WorkflowEdge[],
    // });
  };

  return {
    nodesModel,
    edgesModel,
    // workflow: data as Workflow,
    saveWorkflow: onSave,
    createNode,
  };
};
