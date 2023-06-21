import { v4 } from "uuid";
import { useMessageStore } from "../../stores";
import type { Task } from "../../types/task";

export interface AgentRunModel {
  getName(): string;

  getGoal(): string;

  getId(): string;

  getRemainingTasks(): Task[];

  getCompletedTasks(): string[];

  addCompletedTask(taskValue: string): void;
}

export class DefaultAgentRunModel implements AgentRunModel {
  id: string;
  name: string;
  goal: string;
  completedTasks: string[];

  constructor(name: string, goal: string) {
    this.id = v4().toString();
    this.name = name;
    this.goal = goal;
    this.completedTasks = [];
  }

  getName = () => this.name;
  getGoal = () => this.goal;

  getId = () => this.id;

  getRemainingTasks = (): Task[] => {
    return useMessageStore.getState().tasks.filter((t: Task) => t.status === "started");
  };

  getCompletedTasks = (): string[] => this.completedTasks;

  addCompletedTask = (taskValue: string) => this.completedTasks.push(taskValue);
}
