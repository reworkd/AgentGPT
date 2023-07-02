import { z } from "zod";
import { Node } from "reactflow";

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
export const toReactFlowPartial = (node: WorkflowNode) =>
  ({
    id: node.id ?? node.ref,
    data: node,
    position: { x: node.pos_x, y: node.pos_y },
    type: "custom",
  } as Node<WorkflowNode>);
