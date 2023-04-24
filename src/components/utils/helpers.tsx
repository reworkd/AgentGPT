import {
  isTask,
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
} from "../../types/agentTypes";

import type { Message } from "../../types/agentTypes";

export const getMessageContainerStyle = (message: Message) => {
  if (!isTask(message)) {
    return "border-white/10";
  }

  switch (message.status) {
    case TASK_STATUS_STARTED:
      return "border-white/20 text-white";
    case TASK_STATUS_EXECUTING:
      return "border-white/20 text-white";
    case TASK_STATUS_COMPLETED:
      return "border-green-500 hover:border-green-400 hover:text-green-400 text-green-500";
    default:
      return "";
  }
};
