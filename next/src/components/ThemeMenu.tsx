import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../types";
import { FaAdjust, FaMoon, FaSun } from "react-icons/fa";
import WindowButton from "./WindowButton";
import React from "react";
import Menu from "./Menu";

export const ThemeMenu = () => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case "dark":
        return <FaMoon />;
      case "light":
        return <FaSun />;
      case "system":
        return <FaAdjust />;
    }
  };

  const themeOptions = [
    <WindowButton
      key="Light"
      onClick={(): void => setTheme("light")}
      icon={getThemeIcon("light")}
      name="Light"
    />,
    <WindowButton
      key="Dark"
      onClick={(): void => setTheme("dark")}
      icon={getThemeIcon("dark")}
      name="Dark"
    />,
    <WindowButton
      key="System"
      onClick={(): void => setTheme("system")}
      icon={getThemeIcon("system")}
      name="System"
    />,
  ];

  return <Menu icon={getThemeIcon(theme)} items={themeOptions} buttonPosition="bottom" />;
};
