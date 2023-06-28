import type { StateCreator } from "zustand";
import { createSelectors } from "./helpers";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Theme } from "../types";
import { handleTheme } from "../hooks/useTheme";

const resetters: (() => void)[] = [];

interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialThemeState = {
  theme: "system" as const,
};

const createThemeSlice: StateCreator<ThemeSlice> = (set) => {
  resetters.push(() => set(initialThemeState));

  return {
    ...initialThemeState,
    setTheme: (theme: Theme) => {
      set(() => ({
        theme,
      }));

      handleTheme(theme);
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
        name: "theme",
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
