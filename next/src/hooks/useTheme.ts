import { type Theme, THEMES } from "../types";
import { useEffect } from "react";
const DARK_THEME = "dark";

export const handleTheme = (theme, event?) => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const classList = document.documentElement.classList;

  // true if user's system has dark theme
  const isSystemThemeDark = (event || window?.matchMedia(`(prefers-color-scheme: ${DARK_THEME})`))
    .matches;

  // determine whether App should have dark theme
  const shouldAppThemeBeDark = theme === DARK_THEME || (theme === "system" && isSystemThemeDark);

  if (shouldAppThemeBeDark && !classList.contains(DARK_THEME)) {
    classList.add(DARK_THEME);
  } else {
    classList.remove(DARK_THEME);
  }
};

export const useTheme = (theme: Theme) => {
  theme = THEMES.includes(theme) ? theme : "system";

  useEffect(() => {
    const prefersDark = window.matchMedia(`(prefers-color-scheme: ${DARK_THEME})`);

    prefersDark.addEventListener("change", (event) => {
      handleTheme(theme, event);
    });
  }, []);
};
