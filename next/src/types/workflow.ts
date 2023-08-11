import type { Dispatch, SetStateAction } from "react";
import type { Edge, Node } from "reactflow";
import { z } from "zod";

const NodeBlockSchema = z.object({
  type: z.string(),
  input: z.record(z.string()),
});

export type NodeBlock = z.infer<typeof NodeBlockSchema>;

type Model<T> = [T, Dispatch<SetStateAction<T>>];

const WorkflowNodeSchema = z.object({
  id: z.string().optional(),
  ref: z.string(),
  pos_x: z.number(),
  pos_y: z.number(),
  status: z.enum(["running", "success", "error"]).optional(),
  block: NodeBlockSchema,
});

const WorkflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  source_handle: z.string().optional().nullable(),
  target: z.string(),
  status: z.enum(["running", "success", "error"]).optional(),
});
export const WorkflowSchema = z.object({
  id: z.string(),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
});

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

export type NodesModel = {
  get: () => Node<WorkflowNode>[] | null;
  set: (nodes: Node<WorkflowNode>[]) => void;
};

export type EdgesModel = {
  get: () => Edge<WorkflowEdge>[] | null;
  set: (edges: Edge<WorkflowEdge>[]) => void;
};

export const toReactFlowNode = (node: WorkflowNode) =>
  ({
    id: node.id ?? node.ref,
    data: node,
    position: { x: node.pos_x, y: node.pos_y },
    type: getNodeType(node.block),
  } as Node<WorkflowNode>);

export const toReactFlowEdge = (edge: WorkflowEdge) =>
  ({
    ...edge,
    sourceHandle: edge.source_handle,
    type: "custom",
    data: {
      ...edge,
    },
  } as Edge<WorkflowEdge>);

export const getNodeType = (block: NodeBlock) => {
  switch (block.type) {
    case "ManualTriggerBlock":
      return "trigger";
    case "IfCondition":
      return "if";
    default:
      return "custom";
  }
};
