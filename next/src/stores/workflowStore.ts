import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createSelectors } from "./helpers";

interface Workflow {
  id: string;
  nodes: Node[];
}

interface Node {
  id: string;
  block: Block;
}

interface Block {
  input: Input[];
}

interface Input {
  field: string;
  value: string;
}

interface WorkflowSlice {
  workflow: Workflow | null;
  setWorkflow: (workflow: Workflow) => void;
  setInputs: (workflow: Workflow, nodeToUpdate: Node, updatedInput: Input) => void;
}

const initialState = {
  workflow: null,
};

const createWorkflowSlice: StateCreator<WorkflowSlice> = (set, get) => {
  return {
    ...initialState,
    setWorkflow: (workflow: Workflow) => {
      set(() => ({
        workflow,
      }));
    },
    setInputs: (workflow: Workflow, nodeToUpdate: Node, updatedInput: Input) => {
      set(() => ({
        workflow: {
          ...workflow,
          nodes: workflow.nodes.map((node) => {
            if (node.id === nodeToUpdate.id) {
              if (node.block.input) {
                const updatedInputs = Object.keys(node.block.input).reduce((acc, field) => {
                  if (field === updatedInput.field) {
                    acc[field] = updatedInput.value;
                  }
                  return acc;
                }, { ...node.block.input });
                return {
                  ...node,
                  block: {
                    ...node.block,
                    input: updatedInputs,
                  },
                };
              }
            }
            return node;
          }),
        },
      }));
    },
  };
};


export const useWorkflowStore = createSelectors(
  create<WorkflowSlice>()((...a) => ({
    ...createWorkflowSlice(...a),
  }))
);
