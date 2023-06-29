import type { StateCreator } from "zustand";
import { createSelectors } from "./helpers";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Theme } from "../types";
// import { handleTheme } from "../hooks/useTheme";

const resetters: (() => void)[] = [];

const handleTheme = (theme) => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }
  const classList = document.documentElement.classList;
  const DARK_THEME = "dark";

  // true if user's system has dark theme
  const isSystemThemeDark = window?.matchMedia(`(prefers-color-scheme: ${DARK_THEME})`).matches;
  // determine whether App should have dark theme
  const shouldAppThemeBeDark = theme === DARK_THEME || (theme === "system" && isSystemThemeDark);

  if (shouldAppThemeBeDark && !classList.contains(DARK_THEME)) {
    classList.add(DARK_THEME);
  } else if (!shouldAppThemeBeDark) {
    classList.remove(DARK_THEME);
  }
};

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
      console.log(theme);
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
