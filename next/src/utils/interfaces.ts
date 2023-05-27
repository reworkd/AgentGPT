import type { ModelSettings } from "./types";
import type { Analysis } from "../services/agent-api";

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
}
