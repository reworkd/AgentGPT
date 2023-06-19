export const [DARK_THEME, LIGHT_THEME, SYSTEM_THEME] = [
  "dark" as const,
  "light" as const,
  "system" as const,
];
export const THEMES = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];
export const PREFERRED_THEME = DARK_THEME; // for tailwind, PREFERRED_THEME must be dark

export type Theme = "dark" | "light" | "system";
