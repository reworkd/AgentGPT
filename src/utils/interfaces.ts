import type { ModelSettings } from "./types";
import type { Analysis } from "../services/agent-service";

export interface RequestBody {
  modelSettings: ModelSettings;
  goal: string;
  language: string;
  task?: string;
  tasks?: string[];
  lastTask?: string;
  result?: string;
  completedTasks?: string[];
  analysis?: Analysis;
}
