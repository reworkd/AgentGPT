import type { TFunction } from "i18next";
import { ReactNode } from "react";
import { Message } from "../types/agentTypes";

export type ModelSettings = {
  customApiKey?: string;
  customModelName?: string;
  customTemperature?: number;
  customMaxLoops?: number;
  maxTokens?: number;
};

export type SettingModel = {
  settings: ModelSettings;
  saveSettings: (settings: ModelSettings) => void;
  resetSettings: () => void;
};

export type Translation = TFunction<"translation", undefined>;

export type HeaderProps = {
  title?: string | ReactNode;
  messages: Message[];
  onSave?: (format: string) => void;
};
