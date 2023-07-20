import Graph from "graphology";
import type { Edge, Node } from "reactflow";

import type { WorkflowEdge, WorkflowNode } from "../types/workflow";

export const findParents = (
  nodes: Node<WorkflowNode>[],
  edges: Edge<WorkflowEdge>[],
  node: Node<WorkflowNode>
): Node<WorkflowNode>[] => {
  // If the selected node is deleted, it will still be selected but won't be found in the nodes array
  if (nodes.find((n) => n.id === node.id) === undefined) {
    return [];
  }

  // Create a new directed graph
  const graph = new Graph();

  // Add your nodes to the graph
  nodes.forEach((node) => graph.addNode(node.id, node.data));

  // Add your edges to the graph
  edges.forEach((edge) => {
    if (!graph.hasEdge(edge.source, edge.target)) {
      graph.addEdge(edge.source, edge.target);
    }
  });

  // Get all parents of the given node
  // Perform DFS to find all ancestors
  const ancestors: Set<string> = new Set();
  const stack: string[] = [node.id];

  while (stack.length > 0) {
    const id = stack.pop();
    const predecessors = graph.inboundNeighbors(id);

    for (const pred of predecessors) {
      if (!ancestors.has(pred)) {
        ancestors.add(pred);
        stack.push(pred);
      }
    }
  }

  // Return nodes corresponding to parent IDs
  return nodes.filter((node) => ancestors.has(node.id));
};
