import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message } from "../types/message";

const resetters: (() => void)[] = [];

const initialMessageState = {
  messages: [],
};

interface MessageSlice {
  messages: Message[];
  addMessage: (newMessage: Message) => void;
  updateMessage: (newMessage: Message) => void;
}

const createMessageSlice: StateCreator<MessageSlice, [], [], MessageSlice> = (set) => {
  resetters.push(() => set(initialMessageState));
  return {
    ...initialMessageState,
    addMessage: (newMessage) => {
      set((state) => ({
        ...state,
        messages: [...state.messages, { ...newMessage }],
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
  };
};

export const useMessageStore = createSelectors(
  create<MessageSlice>()((...a) => ({
    ...createMessageSlice(...a),
  }))
);

export const resetAllMessageSlices = () => resetters.forEach((resetter) => resetter());
