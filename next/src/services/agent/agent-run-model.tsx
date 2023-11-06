import { v4 } from "uuid";

import { useAgentStore } from "../../stores";
import { useTaskStore } from "../../stores/taskStore";
import type { Task, TaskStatus } from "../../types/task";

/*
 * Abstraction over model used by Autonomous Agent to encapsulate the data required for a given run
 */
export interface AgentRunModel {
  getId(): string;

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
  private readonly id: string;
  private readonly goal: string;

  constructor(goal: string) {
    this.id = v4().toString();
    this.goal = goal;
  }

  getId = () => this.id;

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
