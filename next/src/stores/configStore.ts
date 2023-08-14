import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSelectors } from "./helpers";

interface Layout {
  showRightSidebar: boolean;
  showLogSidebar: boolean;
}

interface LayoutSlice {
  layout: Layout;
  setLayout: (layout: Partial<Layout>) => void;
}

interface OrganizationRole {
  id: string;
  name: string;
  role: string;
}

interface AuthSlice {
  organization: OrganizationRole | undefined;
  setOrganization: (orgRole: OrganizationRole | undefined) => void;
}

const createLayoutSlice: StateCreator<LayoutSlice> = (set, get) => {
  return {
    ...{
      layout: {
        showRightSidebar: false,
        showLogSidebar: false,
      },
    },
    setLayout: (layout: Partial<Layout>) => {
      if (layout.showLogSidebar) layout.showRightSidebar = false;
      if (layout.showRightSidebar) layout.showLogSidebar = false;

      set((prev) => ({
        layout: {
          ...prev.layout,
          ...layout,
        },
      }));
    },
  };
};

const createAuthSlice: StateCreator<AuthSlice> = (set, get) => {
  return {
    ...{ organization: undefined },
    setOrganization: (orgRole: OrganizationRole | undefined) => {
      set(() => ({
        organization: orgRole,
      }));
    },
  };
};

export const useConfigStore = createSelectors(
  create<LayoutSlice & AuthSlice>()(
    persist(
      (...a) => ({
        ...createLayoutSlice(...a),
        ...createAuthSlice(...a),
      }),
      {
        name: "reworkd-config-2",
        version: 1,
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
