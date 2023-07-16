import type { Edge, Node } from "reactflow";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { NodeBlock, Workflow, WorkflowEdge, WorkflowNode } from "../types/workflow";
import { toReactFlowEdge, toReactFlowNode } from "../types/workflow";
import WorkflowApi from "../services/workflow/workflowApi";
import useSocket from "./useSocket";
import { z } from "zod";
import type { Session } from "next-auth";

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

  const { data: workflow } = useQuery(
    ["workflow", workflowId],
    async () => await api.get(workflowId),
    {
      enabled: !!workflowId && !!session?.accessToken,
    }
  );

  const nodesModel = useState<Node<WorkflowNode>[]>([]);
  const edgesModel = useState<Edge<WorkflowEdge>[]>([]);
  const [nodes, setNodes] = nodesModel;
  const [edges, setEdges] = edgesModel;

  useEffect(() => {
    setNodes(workflow?.nodes.map(toReactFlowNode) ?? []);
    setEdges(workflow?.edges.map(toReactFlowEdge) ?? []);
  }, [setNodes, setEdges, workflow]);

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
        type: "custom",
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
