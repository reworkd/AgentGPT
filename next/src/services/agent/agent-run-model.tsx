import { v4 } from "uuid";
import type { Task } from "../../types/agentTypes";
import { useMessageStore } from "../../stores";

export interface AgentRunModel {
  getName(): string;

  getGoal(): string;

  getId(): string;

  getRemainingTasks(): Task[];
}

export class DefaultAgentRunModel implements AgentRunModel {
  id: string;
  name: string;
  goal: string;

  constructor(name: string, goal: string) {
    this.id = v4().toString();
    this.name = name;
    this.goal = goal;
  }

  getName = () => this.name;
  getGoal = () => this.goal;

  getId = () => this.id;

  getRemainingTasks = (): Task[] => {
    return useMessageStore.getState().tasks.filter((t: Task) => t.status === "started");
  };
}
