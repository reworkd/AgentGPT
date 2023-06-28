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

  getCompletedTasks(): string[];

  addTask(taskValue: string): void;
}

export type AgentLifecycle = "running" | "pausing" | "paused" | "stopped";

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

  getCompletedTasks = (): string[] =>
    useTaskStore
      .getState()
      .tasks.filter((t: Task) => t.status === "completed")
      .map((t: Task) => t.value);

  addTask = (taskValue: string) =>
    useTaskStore.getState().addTask({
      taskId: v4().toString(),
      type: "task",
      value: taskValue,
      status: "started",
    });

  updateTaskStatus(task: Task, status: TaskStatus): Task {
    const updatedTask = {
      ...task,
      status,
    };
    useTaskStore.getState().updateTask(updatedTask);
    return updatedTask;
  }
}
