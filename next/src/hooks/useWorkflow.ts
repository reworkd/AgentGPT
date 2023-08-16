import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import type { Edge, Node } from "reactflow";
import { z } from "zod";

import useSocket from "./useSocket";
import WorkflowApi from "../services/workflow/workflowApi";
import { useWorkflowStore } from "../stores/workflowStore";
import type { NodeBlock, Workflow, WorkflowEdge, WorkflowNode } from "../types/workflow";
import { getNodeType, toReactFlowEdge, toReactFlowNode } from "../types/workflow";

const StatusEventSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["running", "success", "error"]),
  remaining: z.number().optional(),
});

const SaveEventSchema = z.object({
  user_id: z.string(),
});

const updateNodeValue = <
  DATA extends WorkflowNode,
  KEY extends keyof DATA,
  T extends DATA extends WorkflowEdge ? Edge<DATA> : Node<DATA>
>(
  currentNodes: Node<WorkflowNode>[],
  setNodes: (nodes: Node<WorkflowNode>[]) => void,
  key: KEY,
  value: DATA[KEY],
  filter: (node?: T["data"]) => boolean = () => true
) => {
  const updatedNodes = currentNodes.map((t: Node<WorkflowNode>) => {
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
  });

  setNodes(updatedNodes);
};

const updateEdgeValue = <
  DATA extends WorkflowEdge | WorkflowNode,
  KEY extends keyof DATA,
  T extends DATA extends WorkflowEdge ? Edge<DATA> : Node<DATA>
>(
  currentEdges: Edge<WorkflowEdge>[],
  setEdges: (edges: Edge<WorkflowEdge>[]) => void,
  key: KEY,
  value: DATA[KEY],
  filter: (edge?: T["data"]) => boolean = () => true
) => {
  const updatedEdges = currentEdges.map((t: Edge<WorkflowEdge>) => {
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
  }) as Edge<WorkflowEdge>[];

  setEdges(updatedEdges);
};

export const useWorkflow = (
  workflowId: string | undefined,
  session: Session | null,
  organizationId: string | undefined,
  onLog?: (log: LogType) => void
) => {
  const api = new WorkflowApi(session?.accessToken, organizationId);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNode> | undefined>(undefined);

  const { mutateAsync: updateWorkflow } = useMutation(async (data: Workflow) => {
    if (!workflowId) return;
    await api.update(workflowId, data);
  });

  const {
    workflow,
    setInputs,
    updateWorkflow: updateWorkflowStore,
    setWorkflow,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
  } = useWorkflowStore();

  const nodesModel = {
    get: getNodes,
    set: setNodes,
  };

  const edgesModel = {
    get: getEdges,
    set: setEdges,
  };

  const { refetch: refetchWorkflow, isLoading } = useQuery(
    ["workflow", workflowId],
    async () => {
      if (!workflowId) {
        setNodes([]);
        setEdges([]);
        return;
      }

      const workflow = await api.get(workflowId);
      setWorkflow({
        id: workflow.id,
        nodes: workflow.nodes.map(toReactFlowNode),
        edges: workflow.edges.map(toReactFlowEdge),
      });

      return workflow;
    },
    {
      enabled: !!workflowId && !!session?.accessToken,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    if (!workflow?.nodes) return; // Early exit if nodes are not available

    const selectedNodes = workflow.nodes.filter((n) => n.selected);

    if (selectedNodes.length === 0) {
      setSelectedNode(undefined);
    } else {
      setSelectedNode(selectedNodes[0]);
    }
  }, [workflow?.nodes]);

  const members = useSocket(
    workflowId,
    session?.accessToken,
    [
      {
        event: "workflow:node:status",
        callback: async (data) => {
          const { nodeId, status, remaining } = await StatusEventSchema.parseAsync(data);

          updateNodeValue(getNodes() ?? [], setNodes, "status", status, (n) => n?.id === nodeId);
          updateEdgeValue(getEdges() ?? [], setEdges, "status", status, (e) => e?.id === nodeId);

          if (status === "error" || remaining === 0) {
            setTimeout(() => {
              updateNodeValue(getNodes() ?? [], setNodes, "status", undefined);
              updateEdgeValue(getEdges() ?? [], setEdges, "status", undefined);
            }, 1000);
          }
        },
      },
      {
        event: "workflow:updated",
        callback: async (data) => {
          const { user_id } = await SaveEventSchema.parseAsync(data);
          if (user_id !== session?.user?.id) await refetchWorkflow();
        },
      },
      {
        event: "workflow:log",
        callback: async (data) => {
          const log = await LogSchema.parseAsync(data);
          onLog?.({ ...log, date: log.date.substring(11, 19) });
        },
      },
    ],
    {
      enabled: !!workflowId && !!session?.accessToken,
    }
  );

  const createNode: createNodeType = (block: NodeBlock, position: Position) => {
    const ref = nanoid(11);
    const node = {
      id: ref,
      type: getNodeType(block),
      position,
      data: {
        id: undefined,
        ref: ref,
        pos_x: 0,
        pos_y: 0,
        block: block,
      },
    };

    const newNodes = [...(getNodes() ?? []), node];

    setNodes(newNodes);

    return node;
  };

  const updateNode: updateNodeType = (nodeToUpdate: Node<WorkflowNode>) => {
    const nodes = (getNodes() ?? []).map((node) => {
      if (node.id === nodeToUpdate.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...nodeToUpdate.data,
          },
        };
      }
      return node;
    });

    updateWorkflowStore({
      nodes,
    });
  };

  const onSave = async () => {
    if (!workflowId) return;

    const nodes = getNodes() ?? [];
    const edges = getEdges() ?? [];

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
        source_handle: e.sourceHandle || undefined,
        target: e.target,
      })),
    });
  };

  const onExecute = async () => {
    if (!workflowId) return;
    await api.execute(workflowId);
  };

  return {
    nodesModel,
    edgesModel,
    selectedNode,
    saveWorkflow: onSave,
    executeWorkflow: onExecute,
    createNode,
    updateNode,
    members,
    isLoading,
  };
};

const LogSchema = z.object({
  // level: z.enum(["info", "error"]),
  date: z.string().refine((date) => date.substring(0, 19)), // Get rid of milliseconds
  msg: z.string(),
});

export type LogType = z.infer<typeof LogSchema>;
export type Position = { x: number; y: number };
export type createNodeType = (block: NodeBlock, position: Position) => Node<WorkflowNode>;
export type updateNodeType = (node: Node<WorkflowNode>) => void;
