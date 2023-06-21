import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message } from "../types/message";
import type { Task } from "../types/task";
import {
  isTask,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_FINAL,
} from "../types/task";
import { createSelectors } from "./helpers";

export const isExistingTask = (message: Message): boolean =>
  isTask(message) &&
  (message.status === TASK_STATUS_EXECUTING ||
    message.status === TASK_STATUS_COMPLETED ||
    message.status === TASK_STATUS_FINAL);

const resetters: (() => void)[] = [];

const initialTaskState = {
  tasks: [],
};

export interface TaskSlice {
  tasks: Task[];
  addTask: (newTask: Task) => void;
  updateTaskStatus: (updatedTask: Task) => void;
}

export const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (set) => {
  resetters.push(() => set(initialTaskState));

  return {
    ...initialTaskState,
    addTask: (newTask) => {
      set((state) => ({
        ...state,
        tasks: [...state.tasks, { ...newTask }],
      }));
    },
    updateTaskStatus: (updatedTask) => {
      const { taskId, info, status: newStatus } = updatedTask;

      if (!isExistingTask(updatedTask) || taskId === undefined) {
        return;
      }

      set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.taskId === taskId) {
            return {
              ...task,
              status: newStatus,
              info,
            };
          }
          return task;
        });

        return {
          ...state,
          tasks: updatedTasks,
        };
      });
    },
  };
};

export const useTaskStore = createSelectors(
  create<TaskSlice>()((...a) => ({
    ...createTaskSlice(...a),
  }))
);

export const resetAllTaskSlices = () => resetters.forEach((resetter) => resetter());
