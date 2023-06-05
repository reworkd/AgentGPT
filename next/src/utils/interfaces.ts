import type { ModelSettings } from "./types";
import type { Analysis } from "../services/agent/analysis";

export interface RequestBody {
  modelSettings: ModelSettings;
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
