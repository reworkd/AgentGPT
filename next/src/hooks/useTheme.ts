import { type Theme, THEMES } from "../types";
import { useEffect } from "react";
import { useThemeStore } from "../stores";

export const useTheme = (theme: Theme) => {
  theme = THEMES.includes(theme) ? theme : "system";

  useEffect(() => {
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`);

    prefersDark.addEventListener("change", () => {
      useThemeStore.getState().setTheme(theme);
    });
  }, []);
};
