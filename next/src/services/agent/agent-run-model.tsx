import { v4 } from "uuid";
import type { Task, TaskStatus } from "../../types/task";
import { useTaskStore } from "../../stores/taskStore";

export interface AgentRunModel {
  getName(): string;

  getGoal(): string;

  getId(): string;

  getRemainingTasks(): Task[];

  getCurrentTask(): Task | undefined;

  updateTaskStatus(task: Task, status: TaskStatus): Task;

  getCompletedTasks(): string[];

  addTask(taskValue: string): void;
}

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

  getName = () => this.name;
  getGoal = () => this.goal;

  getId = () => this.id;

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
