import type { StateCreator } from "zustand";
import { create } from "zustand";

import { createSelectors } from "./helpers";

interface Layout {
  showRightSidebar: boolean;
}

interface LayoutSlice {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

const initialState = {
  layout: {
    showRightSidebar: false,
  },
};

const createLayoutSlice: StateCreator<LayoutSlice> = (set, get) => {
  return {
    ...initialState,
    setLayout: (layout: Layout) => {
      set(() => ({
        layout,
      }));
    },
  };
};

export const useLayoutStore = createSelectors(
  create<LayoutSlice>()((...a) => ({
    ...createLayoutSlice(...a),
  }))
);
