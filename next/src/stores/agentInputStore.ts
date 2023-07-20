import type { StateCreator } from "zustand";
import { create } from "zustand";

import { createSelectors } from "./helpers";

const resetters: (() => void)[] = [];

interface AgentInputSlice {
  nameInput: string;
  goalInput: string;
  setNameInput: (nameInput: string) => void;
  setGoalInput: (goalInput: string) => void;
  resetInputs: () => void;
}

const initialInputState = {
  nameInput: "",
  goalInput: "",
};

const createAgentInputSlice: StateCreator<AgentInputSlice> = (set) => {
  resetters.push(() => set(initialInputState));
  return {
    ...initialInputState,
    setNameInput: (nameInput: string) => {
      set(() => ({ nameInput }));
    },
    setGoalInput: (goalInput: string) => {
      set(() => ({ goalInput }));
    },
    resetInputs: () => {
      set(initialInputState);
    },
  };
};
export const useAgentInputStore = createSelectors(
  create<AgentInputSlice>()((...a) => ({
    ...createAgentInputSlice(...a),
  }))
);
