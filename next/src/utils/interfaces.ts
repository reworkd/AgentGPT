import type { Analysis } from "../services/agent/analysis";
import type { ModelSettings } from "../types";

export interface ApiModelSettings extends Omit<ModelSettings, "language"> {
  language: string;
}

export interface RequestBody {
  modelSettings: ApiModelSettings;
  goal: string;
  task?: string;
  tasks?: string[];
  lastTask?: string;
  result?: string;
  completedTasks?: string[];
  analysis?: Analysis;
  toolNames?: string[];
  run_id?: string;
}
