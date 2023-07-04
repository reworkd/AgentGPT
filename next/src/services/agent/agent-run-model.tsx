import { v4 } from "uuid";
import type { Task, TaskStatus } from "../../types/task";
import { useTaskStore } from "../../stores/taskStore";
import { useAgentStore } from "../../stores";

/*
 * Abstraction over model used by Autonomous Agent to encapsulate the data required for a given run
 */
export interface AgentRunModel {
  getId(): string;

  getName(): string;

  getGoal(): string;

  getLifecycle(): AgentLifecycle;

  setLifecycle(AgentLifecycle): void;

  getRemainingTasks(): Task[];

  getCurrentTask(): Task | undefined;

  updateTaskStatus(task: Task, status: TaskStatus): Task;

  updateTaskResult(task: Task, result: string): Task;

  getCompletedTasks(): Task[];

  addTask(taskValue: string): void;
}
 
export type AgentLifecycle = "offline" | "running" | "pausing" | "paused" | "stopped";

export class DefaultAgentRunModel implements AgentRunModel {
  id: string;
  name: string;
  goal: string;
  tasks: string[];
  completedTasks: string[];

  constructor(name: string, goal: string) {
    this.id = v4().toString();
    this.name = name;
    this.goal = goal;
    this.tasks = [];
    this.completedTasks = [];
  }

  getId = () => this.id;
  getName = () => this.name;
  getGoal = () => this.goal;
  getLifecycle = (): AgentLifecycle => useAgentStore.getState().lifecycle;
  setLifecycle = (lifecycle: AgentLifecycle) => useAgentStore.getState().setLifecycle(lifecycle);

  getRemainingTasks = (): Task[] => {
    return useTaskStore.getState().tasks.filter((t: Task) => t.status === "started");
  };

  getCurrentTask = (): Task | undefined => this.getRemainingTasks()[0];

  getCompletedTasks = (): Task[] =>
    useTaskStore.getState().tasks.filter((t: Task) => t.status === "completed");

  addTask = (taskValue: string): void =>
    useTaskStore.getState().addTask({
      id: v4().toString(),
      type: "task",
      value: taskValue,
      status: "started",
      result: "",
    });

  updateTaskStatus(task: Task, status: TaskStatus): Task {
    return this.updateTask({ ...task, status });
  }

  updateTaskResult(task: Task, result: string): Task {
    return this.updateTask({ ...task, result });
  }

  updateTask(updatedTask: Task): Task {
    useTaskStore.getState().updateTask(updatedTask);
    return updatedTask;
  }
}
