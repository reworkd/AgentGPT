import { createSelectors } from "./helpers";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { Message, Task } from "../types/agentTypes";
import {
  isTask,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
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
  latestIteration: 0,
};

interface MessageSlice {
  messages: Message[];
  latestIteration: number;
  addMessage: (newMessage: Message) => void;
  updateMessage: (newMessage: Message) => void;
  deleteMessage: (targetMessage: Message) => void;
}

const createMessageSlice: StateCreator<
  MessageSlice & TaskSlice,
  [],
  [],
  MessageSlice
> = (set, get) => {
  resetters.push(() => set(initialMessageState));
  return {
    ...initialMessageState,
    addMessage: (newMessage) => {
      const newTask = { ...newMessage };
      newMessage = { ...newMessage };
      set((state) => ({
        ...state,
        ...(newMessage.iteration !== undefined && {
          latestIteration: Math.max(
            state.latestIteration,
            newMessage.iteration
          ),
        }),
        messages: [...state.messages, newMessage],
        tasks:
          isTask(newTask) && !isExistingTask(newTask)
            ? [...state.tasks, newTask]
            : [...state.tasks],
      }));
    },
    updateMessage: (newMessage) => {
      if (isTask(newMessage)) {
        set((state) => {
          return {
            ...state,
            messages: getUpdatedTasks(newMessage, state.messages),
          };
        });
        get().updateTask(newMessage);
      }
    },
    deleteMessage: (targetMessage) => {
      if (isTask(targetMessage)) {
        set((state) => {
          return {
            ...state,
            messages: getTasksAfterRemoval(targetMessage, state.messages),
          };
        });
        get().deleteTask(targetMessage);
      }
    },
  };
};

const initialTaskState = {
  tasks: [],
};

interface TaskSlice {
  tasks: Task[];
  updateTask: (updatedTask: Task, typeOfUpdate?: "existing" | "all") => void;
  deleteTask: (targetTask: Task) => void;
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
    updateTask: (newTask, typeOfUpdate) => {
      if (typeOfUpdate === "existing" && !isExistingTask(newTask)) {
        return;
      }
      set((state) => {
        return {
          ...state,
          tasks: getUpdatedTasks(newTask, state.tasks) as Task[],
        };
      });
    },
    deleteTask: (targetTask) => {
      set((state) => {
        return {
          ...state,
          tasks: getTasksAfterRemoval(targetTask, state.tasks) as Task[],
        };
      });
    },
  };
};

/* Helper functions */
const getUpdatedTasks = (newTask: Task, messages: Message[]) => {
  const { taskId, info, status, value } = newTask;

  if (taskId === undefined) {
    return messages;
  }

  return messages.map((task) => {
    if (isTask(task) && task.taskId === taskId) {
      return {
        ...task,
        status,
        value,
        info,
      };
    }
    return task;
  });
};

const getTasksAfterRemoval = (targetTask: Task, messages: Message[]) => {
  const { taskId } = targetTask;

  if (taskId === undefined) {
    return messages;
  }

  return messages.filter((task) => {
    if ((isTask(task) && task.taskId !== taskId) || !isTask(task)) {
      return {
        ...task,
      };
    }
  });
};

/* Exports */
export const useMessageStore = createSelectors(
  create<MessageSlice & TaskSlice>()((...a) => ({
    ...createMessageSlice(...a),
    ...createTaskSlice(...a),
  }))
);

export const resetAllMessageSlices = () =>
  resetters.forEach((resetter) => resetter());
