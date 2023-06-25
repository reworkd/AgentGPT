import type { Analysis } from "../services/agent/analysis";
import type { GPTModelNames, ModelSettings } from "../types";

export interface ApiModelSettings {
  language: string;
  model: GPTModelNames;
  temperature: number;
  max_tokens: number;
}

export const toApiModelSettings = (modelSettings: ModelSettings) => ({
  language: modelSettings.language.name,
  model: modelSettings.customModelName,
  temperature: modelSettings.customTemperature,
  max_tokens: modelSettings.maxTokens,
  custom_api_key: modelSettings.customApiKey,
});

export interface RequestBody {
  model_settings: ApiModelSettings;
  goal: string;
  task?: string;
  tasks?: string[];
  last_task?: string;
  result?: string;
  completed_tasks?: string[];
  analysis?: Analysis;
  tool_names?: string[];
  run_id?: string;
}
