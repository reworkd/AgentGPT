import type { StateCreator } from "zustand";
import { create } from "zustand";

import { createSelectors } from "./helpers";
import type { Message } from "../types/message";
import type { Task } from "../types/task";
import { isTask, TASK_STATUS_COMPLETED, TASK_STATUS_EXECUTING } from "../types/task";

export const isExistingTask = (message: Message): boolean =>
  isTask(message) &&
  (message.status === TASK_STATUS_EXECUTING || message.status === TASK_STATUS_COMPLETED);

const resetters: (() => void)[] = [];

const initialTaskState = {
  tasks: [],
};

export interface TaskSlice {
  tasks: Task[];
  addTask: (newTask: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
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
    updateTask: (updatedTask) => {
      set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.id === updatedTask.id && task.taskId == updatedTask.taskId) {
            return {
              ...updatedTask,
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
    deleteTask: (taskId) => {
      set((state) => ({
        ...state,
        tasks: state.tasks.filter((task) => task.taskId !== taskId),
      }));
    },
  };
};

export const useTaskStore = createSelectors(
  create<TaskSlice>()((...a) => ({
    ...createTaskSlice(...a),
  }))
);

export const resetAllTaskSlices = () => resetters.forEach((resetter) => resetter());
