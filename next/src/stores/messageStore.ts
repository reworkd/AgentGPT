import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message, Task } from "../types/agentTypes";
import {
  isTask,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_FINAL,
} from "../types/agentTypes";

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
  updateLastMessage: (newMessage: Message) => void;
  deleteTask: (id: string) => void;
}

const createMessageSlice: StateCreator<MessageSlice & TaskSlice, [], [], MessageSlice> = (set) => {
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

    updateLastMessage: (newMessage) => {
      set((state) => {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage) {
          const updatedMessages = state.messages.map((message) => {
            if (message === lastMessage) {
              return newMessage;
            }
            return message;
          });
          return {
            ...state,
            messages: updatedMessages,
          };
        }
        return state;
      });
    },

    deleteTask: (id) => {
      set((state) => ({
        ...state,
        tasks: state.tasks.filter((task) => task.id !== id),
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
}

const createTaskSlice: StateCreator<MessageSlice & TaskSlice, [], [], TaskSlice> = (set) => {
  resetters.push(() => set(initialTaskState));
  return {
    ...initialTaskState,
    updateTaskStatus: (updatedTask) => {
      const { id, info, status: newStatus } = updatedTask;

      if (!isExistingTask(updatedTask) || id === undefined) {
        return;
      }

      set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.id === id) {
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

export const useMessageStore = createSelectors(
  create<MessageSlice & TaskSlice>()((...a) => ({
    ...createMessageSlice(...a),
    ...createTaskSlice(...a),
  }))
);

export const resetAllMessageSlices = () => resetters.forEach((resetter) => resetter());
