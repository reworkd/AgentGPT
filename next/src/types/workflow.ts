import { z } from "zod";
import type { Node } from "reactflow";
import type { Dispatch, SetStateAction } from "react";

type Model<T> = [T, Dispatch<SetStateAction<T>>];

const WorkflowNodeSchema = z.object({
  id: z.string().optional(),
  ref: z.string(),
  pos_x: z.number(),
  pos_y: z.number(),
});

const WorkflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});
export const WorkflowSchema = z.object({
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
});

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

export type NodesModel = Model<Node<WorkflowNode>[]>;
export type EdgesModel = Model<WorkflowEdge[]>;

export const toReactFlowPartial = (node: WorkflowNode) =>
  ({
    id: node.id ?? node.ref,
    data: node,
    position: { x: node.pos_x, y: node.pos_y },
    type: "custom",
  } as Node<WorkflowNode>);
