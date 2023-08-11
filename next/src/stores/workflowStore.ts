import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from "reactflow";
import { create } from "zustand";

import { createSelectors } from "./helpers";
import type { WorkflowEdge, WorkflowNode } from "../types/workflow";

interface Workflow {
  id: string;
  nodes: ReactFlowNode<WorkflowNode>[];
  edges: ReactFlowEdge<WorkflowEdge>[];
}

interface Input {
  field: string;
  value: string;
}

const initialState = {
  workflow: null,
};

type Store = {
  workflow: Workflow | null;
  setWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (workflow: Partial<Workflow>) => void;
  setInputs: (
    workflow: Workflow,
    nodeToUpdate: ReactFlowNode<WorkflowNode>,
    updatedInput: Input
  ) => void;
  setNodes: (nodes: ReactFlowNode<WorkflowNode>[]) => void;
  setEdges: (edges: ReactFlowEdge<WorkflowEdge>[]) => void;
  getNodes: () => ReactFlowNode<WorkflowNode>[] | null;
  getEdges: () => ReactFlowEdge<WorkflowEdge>[] | null;
};

export const useWorkflowStore = createSelectors(
  create<Store>((set, get) => ({
    ...initialState,

    setWorkflow: (workflow: Workflow) => {
      set({ workflow });
    },

    setInputs: (
      workflow: Workflow,
      nodeToUpdate: ReactFlowNode<WorkflowNode>,
      updatedInput: Input
    ) => {
      set({
        workflow: {
          ...workflow,
          nodes: workflow.nodes.map((node) => {
            if (node.data.id === nodeToUpdate.data.id) {
              if (node.data.block.input) {
                const updatedInputs = Object.keys(node.data.block.input).reduce(
                  (acc, field) => {
                    if (field === updatedInput.field) {
                      acc[field] = updatedInput.value;
                    }
                    return acc;
                  },
                  { ...node.data.block.input }
                );
                return {
                  ...node,
                  block: {
                    ...node.data.block,
                    input: updatedInputs,
                  },
                };
              }
            }
            return node;
          }),
        },
      });
    },

    updateWorkflow: (workflow: Partial<Workflow>) => {
      const currentWorkflow = get().workflow;
      if (currentWorkflow) {
        set({
          workflow: {
            ...currentWorkflow,
            ...workflow,
          },
        });
      }
    },

    setNodes: (nodes: ReactFlowNode<WorkflowNode>[]) => {
      const currentWorkflow = get().workflow;
      if (currentWorkflow) {
        set({
          workflow: {
            ...currentWorkflow,
            id: currentWorkflow?.id,
            nodes,
          },
        });
      }
    },
    setEdges: (edges: ReactFlowEdge<WorkflowEdge>[]) => {
      const currentWorkflow = get().workflow;
      if (currentWorkflow) {
        set({
          workflow: {
            ...currentWorkflow,
            id: currentWorkflow.id,
            edges,
          },
        });
      }
    },
    getNodes: () => {
      const currentWorkflow = get().workflow;
      return currentWorkflow ? currentWorkflow.nodes : null;
    },
    getEdges: () => {
      const currentWorkflow = get().workflow;
      return currentWorkflow ? currentWorkflow.edges : null;
    },
  }))
);
