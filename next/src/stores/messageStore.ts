import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message } from "../types/message";
import { isTask } from "../types/task";
import type { TaskSlice } from "./taskStore";
import { createTaskSlice, isExistingTask } from "./taskStore";

const resetters: (() => void)[] = [];

const initialMessageState = {
  messages: [],
};

interface MessageSlice {
  messages: Message[];
  addMessage: (newMessage: Message) => void;
  updateMessage: (newMessage: Message) => void;
  deleteTask: (taskId: string) => void;
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

    updateMessage: (newMessage) => {
      set((state) => {
        const oldMessage = state.messages.find((message) => message.id === newMessage.id);
        if (oldMessage) {
          const updatedMessages = state.messages.map((message) =>
            message.id === oldMessage.id ? newMessage : message
          );
          return {
            ...state,
            messages: updatedMessages,
          };
        }
        return state;
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

export const useMessageStore = createSelectors(
  create<MessageSlice & TaskSlice>()((...a) => ({
    ...createMessageSlice(...a),
    ...createTaskSlice(...a),
  }))
);

export const resetAllMessageSlices = () => resetters.forEach((resetter) => resetter());
