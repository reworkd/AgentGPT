import { type Theme, THEMES } from "../types";
import { useEffect } from "react";
const PREFERRED_THEME = "dark"; // preferred theme must be dark for Tailwind

function isPreferredTheme(theme, matchObj?) {
  if (typeof window === "undefined") {
    return;
  }

  const preferredThemeMatches = (
    matchObj || window?.matchMedia(`(prefers-color-scheme: ${PREFERRED_THEME})`)
  ).matches;

  return theme === PREFERRED_THEME || (theme === "system" && preferredThemeMatches);
}

export function handleTheme(theme, matchObj?) {
  if (typeof document === "undefined") {
    return;
  }

  const classList = document.documentElement.classList;

  if (isPreferredTheme(theme, matchObj)) {
    classList.add(PREFERRED_THEME);
  } else {
    classList.remove(PREFERRED_THEME);
  }
}

export function useTheme(theme: Theme) {
  theme = THEMES.includes(theme) ? theme : "system";

  useEffect(() => {
    const preferredTheme = window.matchMedia(`(prefers-color-scheme: ${PREFERRED_THEME})`);

    preferredTheme.addEventListener("change", (event) => {
      handleTheme(theme, event);
    });
  }, []);
}
