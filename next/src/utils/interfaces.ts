import type { Session } from "next-auth";

import type { Analysis } from "../services/agent/analysis";
import type { GPTModelNames, ModelSettings } from "../types";

export interface ApiModelSettings {
  language: string;
  model: GPTModelNames;
  temperature: number;
  max_tokens: number;
}

export const toApiModelSettings = (modelSettings: ModelSettings, session?: Session) => {
  const allowCustomization = session?.user;

  return {
    language: modelSettings.language.name,
    model: allowCustomization ? modelSettings.customModelName : "gpt-3.5-turbo",
    temperature: modelSettings.customTemperature,
    max_tokens: allowCustomization ? modelSettings.maxTokens : 500,
    custom_api_key: modelSettings.customApiKey,
  };
};

export interface RequestBody {
  run_id?: string;
  model_settings: ApiModelSettings;
  goal: string;
  task?: string;
  tasks?: string[];
  last_task?: string;
  result?: string;
  results?: string[];
  completed_tasks?: string[];
  analysis?: Analysis;
  tool_names?: string[];
  message?: string; // Used for the chat endpoint
}
