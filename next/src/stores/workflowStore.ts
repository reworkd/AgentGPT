import type { StateCreator } from "zustand";
import { create } from "zustand";

import { createSelectors } from "./helpers";

interface Workflow {
  id: string;
}

interface WorkflowSlice {
  workflow: Workflow | null;
  setWorkflow: (workflow: Workflow) => void;
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
  };
};

export const useWorkflowStore = createSelectors(
  create<WorkflowSlice>()((...a) => ({
    ...createWorkflowSlice(...a),
  }))
);
