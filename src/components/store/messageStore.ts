import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { TaskStatus, Message, Task } from "../../types/agentTypes";
import { isTask } from "../../types/agentTypes";

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
      set((state) => ({
        ...state,
        messages: [...state.messages, newMessage],
        tasks: isTask(newMessage)
          ? [...state.tasks, newMessage]
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
  updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
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
    updateTaskStatus: (id, newStatus) => {
      set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              status: newStatus,
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

export const resetAllSlices = () => resetters.forEach((resetter) => resetter());
