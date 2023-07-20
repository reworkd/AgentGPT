import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Session } from "next-auth";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { Edge, Node } from "reactflow";
import { z } from "zod";

import useSocket from "./useSocket";
import WorkflowApi from "../services/workflow/workflowApi";
import { useWorkflowStore } from "../stores/workflowStore";
import type { NodeBlock, Workflow, WorkflowEdge, WorkflowNode } from "../types/workflow";
import { getNodeType, toReactFlowEdge, toReactFlowNode } from "../types/workflow";



const eventSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["running", "success", "failure"]),
  remaining: z.number().optional(),
});

const updateValue = <
  DATA extends WorkflowEdge | WorkflowNode,
  KEY extends keyof DATA,
  T extends DATA extends WorkflowEdge ? Edge<DATA> : Node<DATA>
>(
  setState: Dispatch<SetStateAction<T[]>>,
  key: KEY,
  value: DATA[KEY],
  filter: (node?: T["data"]) => boolean = () => true
) =>
  setState((prev) =>
    prev.map((t) => {
      if (filter(t.data)) {
        return {
          ...t,
          data: {
            ...t.data,
            [key]: value,
          },
        };
      }

      return t;
    })
  );

export const useWorkflow = (workflowId: string, session: Session | null) => {
  const api = new WorkflowApi(session?.accessToken);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNode> | undefined>(undefined);
  const { mutateAsync: updateWorkflow } = useMutation(
    async (data: Workflow) => await api.update(workflowId, data)
  );

  const workflowStore = useWorkflowStore();

  useQuery(
    ["workflow", workflowId],
    async () => {
      const workflow = await api.get(workflowId);

      workflowStore.setWorkflow(workflow);
      setNodes(workflow?.nodes.map(toReactFlowNode) ?? []);
      setEdges(workflow?.edges.map(toReactFlowEdge) ?? []);

      return workflow;
    },
    {
      enabled: !!workflowId && !!session?.accessToken,
    }
  );

  const nodesModel = useState<Node<WorkflowNode>[]>([]);
  const edgesModel = useState<Edge<WorkflowEdge>[]>([]);
  const [nodes, setNodes] = nodesModel;
  const [edges, setEdges] = edgesModel;

  useEffect(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length == 0) setSelectedNode(undefined);
    else setSelectedNode(selectedNodes[0]);
  }, [nodes]);

  useSocket(workflowId, eventSchema, ({ nodeId, status, remaining }) => {
    updateValue(setNodes, "status", status, (n) => n?.id === nodeId);
    updateValue(setEdges, "status", status, (e) => e?.target === nodeId);

    if (remaining === 0) {
      setTimeout(() => {
        updateValue(setNodes, "status", undefined);
        updateValue(setEdges, "status", undefined);
      }, 1000);
    }
  });

  const createNode: createNodeType = (block: NodeBlock) => {
    const ref = nanoid(11);

    setNodes((nodes) => [
      ...(nodes ?? []),
      {
        id: ref,
        type: getNodeType(block),
        position: { x: 0, y: 0 },
        data: {
          id: undefined,
          ref: ref,
          pos_x: 0,
          pos_y: 0,
          block: block,
        },
      },
    ]);
  };

  const updateNode: updateNodeType = (nodeToUpdate: Node<WorkflowNode>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeToUpdate.id) {
          node.data = {
            ...nodeToUpdate.data,
          };
        }

        return node;
      })
    );
  };

  const onSave = async () => {
    await updateWorkflow({
      id: workflowId,
      nodes: nodes.map((n) => ({
        id: n.data.id,
        ref: n.data.ref,
        pos_x: n.position.x,
        pos_y: n.position.y,
        block: n.data.block,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    });
  };

  const onExecute = async () => await api.execute(workflowId);

  return {
    selectedNode,
    setSelectedNode,
    nodesModel,
    edgesModel,
    saveWorkflow: onSave,
    executeWorkflow: onExecute,
    createNode,
    updateNode,
  };
};

export type createNodeType = (block: NodeBlock) => void;
export type updateNodeType = (node: Node<WorkflowNode>) => void;
