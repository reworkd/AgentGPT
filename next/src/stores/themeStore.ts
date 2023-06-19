import type { StateCreator } from "zustand";
import { createSelectors } from "./helpers";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Theme } from "../types";
import { SYSTEM_THEME } from "../types";
import { handleTheme } from "../hooks/useTheme";

const resetters: (() => void)[] = [];

interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialThemeState = {
  theme: SYSTEM_THEME,
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
              console.log("an error happened during hydration. ", error);
            } else {
              handleTheme(state ? state.theme : SYSTEM_THEME);
            }
          };
        },
      }
    )
  )
);

export const resetAllThemeSlices = () => resetters.forEach((resetter) => resetter());
