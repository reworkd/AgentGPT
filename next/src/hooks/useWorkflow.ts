import type { Edge, Node } from "reactflow";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, put } from "../services/fetch-utils";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { toReactFlowPartial, Workflow, WorkflowNode, WorkflowSchema } from "../types/workflow";

export const useWorkflow = (workflowId: string) => {
  const { data: session } = useSession();

  const { mutateAsync: updateWorkflow } = useMutation(async (update: Workflow) => {
    return put(`/api/workflow/${workflowId}`, z.any(), update, session?.accessToken);
  });

  const workflowQuery = useQuery(
    ["workflow", workflowId],
    async () => {
      return await get(`/api/workflow/${workflowId}`, WorkflowSchema, session?.accessToken);
    },
    {
      enabled: !!workflowId && !!session?.accessToken,
    }
  );

  const nodesModel = useState<Node<WorkflowNode>[]>([]);
  const edgesModel = useState<Edge[]>([]);
  const [nodes, setNodes] = nodesModel;
  const [edges, setEdges] = edgesModel;

  useEffect(() => {
    setNodes(workflowQuery.data?.nodes.map(toReactFlowPartial) ?? []);
    setEdges(workflowQuery.data?.edges ?? []);
  }, [setNodes, setEdges, workflowQuery.data]);

  useEffect(() => {
    console.log(edges, edgesModel);
  }, [edges, edgesModel]);

  const createNode = () => {
    const ref = nanoid(11);

    setNodes((nodes) => [
      ...(nodes ?? []),
      {
        id: ref,
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          id: undefined,
          ref: ref,
          pos_x: 0,
          pos_y: 0,
        },
      },
    ]);
  };

  const onSave = async () => {
    await updateWorkflow({
      nodes: nodes.map((n) => ({
        id: n.data.id,
        ref: n.data.ref,
        pos_x: n.position.x,
        pos_y: n.position.y,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    });
  };

  return {
    nodesModel,
    edgesModel,
    saveWorkflow: onSave,
    createNode,
  };
};
