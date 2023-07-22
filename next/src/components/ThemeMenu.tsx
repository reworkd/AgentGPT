import React from "react";
import { FaAdjust, FaMoon, FaSun } from "react-icons/fa";

import Menu from "./Menu";
import WindowButton from "./WindowButton";
import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../types";



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
      text="Light"
    />,
    <WindowButton
      key="Dark"
      onClick={(): void => setTheme("dark")}
      icon={getThemeIcon("dark")}
      text="Dark"
    />,
    <WindowButton
      key="System"
      onClick={(): void => setTheme("system")}
      icon={getThemeIcon("system")}
      text="System"
    />,
  ];

  return <Menu icon={getThemeIcon(theme)} items={themeOptions} buttonPosition="bottom" />;
};
