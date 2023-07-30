import type { StateCreator } from "zustand";
import { create } from "zustand";
import createNodesSlice from './nodeStore';
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
              console.log('made it through node nest');
              console.log(node);
              console.log(updatedInput);
              if (node.block.input) {
                Object.keys(node.block.input).reduce((acc, field) => {
                  if (field === updatedInput.field) {
                    console.log('Input updated:', updatedInput);
                    acc[field] = updatedInput.value;
                  }
                  return acc;
                }, {});
                return {
                  ...node,
                  block: {
                    ...node.block,
                  },
                };
              }
            }
            return node;
          }),
        },
      }));
    }
  };
};

export const useWorkflowStore = createSelectors(
  create<WorkflowSlice>()((...a) => ({
    ...createWorkflowSlice(...a),
  }))
);
