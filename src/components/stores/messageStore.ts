import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message, Task } from "../../types/agentTypes";
import {
  isTask,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
} from "../../types/agentTypes";

const isExistingTask = (message: Message): boolean =>
  isTask(message) &&
  (message.status === TASK_STATUS_EXECUTING ||
    message.status === TASK_STATUS_COMPLETED ||
    message.status === TASK_STATUS_FINAL);

const resetters: (() => void)[] = [];

const initialMessageState = {
  messages: [],
};

interface MessageSlice {
  messages: Message[];
  addMessage: (newMessage: Message) => void;
}

const createMessageSlice: StateCreator<
  MessageSlice & TaskSlice,
  [],
  [],
  MessageSlice
> = (set) => {
  resetters.push(() => set(initialMessageState));
  return {
    ...initialMessageState,
    addMessage: (newMessage) => {
      const newTask = { ...newMessage };
      newMessage = { ...newMessage };
      set((state) => ({
        ...state,
        messages: [...state.messages, newMessage],
        tasks:
          isTask(newTask) && !isExistingTask(newTask)
            ? [...state.tasks, newTask]
            : [...state.tasks],
      }));
    },
  };
};

const initialTaskState = {
  tasks: [],
};

interface TaskSlice {
  tasks: Task[];
  updateTaskStatus: (updatedTask: Task) => void;
  reorderTasks: (startIdx: number, targetIdx: number) => void;
  deleteTask: (taskToDelete: Task) => void;
}

const createTaskSlice: StateCreator<
  MessageSlice & TaskSlice,
  [],
  [],
  TaskSlice
> = (set) => {
  resetters.push(() => set(initialTaskState));
  return {
    ...initialTaskState,
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
    reorderTasks: (startIdx: number, targetIdx: number) => {
      set((state) => {
          if (startIdx < 0 || startIdx >= state.tasks.length || targetIdx < 0 || targetIdx >= state.tasks.length){
            return {...state};
          }
          const updatedTasks = Array.from(state.tasks);
          const [removed] = updatedTasks.splice(startIdx, 1);
          updatedTasks.splice(targetIdx, 0, removed!);

          return {
            ...state,
            tasks: updatedTasks,
          };
      });
    },
    deleteTask: (taskToDelete) => {
      set((state) => {
        const updatedTasks = state.tasks.filter((task) => {
          return task.taskId! != taskToDelete.taskId!;
        });
        return {
          ...state,
          tasks: updatedTasks,
        };
      })
    }
  };
};

export const useMessageStore = createSelectors(
  create<MessageSlice & TaskSlice>()((...a) => ({
    ...createMessageSlice(...a),
    ...createTaskSlice(...a),
  }))
);

export const resetAllMessageSlices = () =>
  resetters.forEach((resetter) => resetter());
