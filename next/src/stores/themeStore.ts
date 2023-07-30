import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSelectors } from "./helpers";
import { handleTheme } from "../hooks/useTheme";
import type { Theme } from "../types";

const resetters: (() => void)[] = [];

interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialThemeState = {
  theme: "light" as const,
};

const createThemeSlice: StateCreator<ThemeSlice> = (set) => {
  resetters.push(() => set(initialThemeState));

  return {
    ...initialThemeState,
    setTheme: (theme: Theme) => {
      set(() => ({
        theme,
      }));
    },
  };
};

export const useThemeStore = createSelectors(
  create<ThemeSlice>()(
    persist(
      (...a) => ({
        ...createThemeSlice(...a),
      }),
      {
        name: "agentgpt-theme",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error("an error happened during hydration. ", error);
            } else {
              handleTheme(state ? state.theme : "system");
            }
          };
        },
      }
    )
  )
);

export const resetAllThemeSlices = () => resetters.forEach((resetter) => resetter());
