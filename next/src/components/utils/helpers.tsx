import {
  FaCheckCircle,
  FaCircleNotch,
  FaExclamationTriangle,
  FaStar,
  FaStopCircle,
  FaThumbtack,
} from "react-icons/fa";

import type { Message } from "../../types/message";
import { MESSAGE_TYPE_ERROR, MESSAGE_TYPE_GOAL } from "../../types/message";
import {
  getTaskStatus,
  isTask,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/task";

export const getMessageContainerStyle = (message: Message) => {
  if (!isTask(message)) {
    switch (message.type) {
      case "error":
        return "border-yellow-400 hover:border-yellow-300 transition-colors";
      default:
        return "border-white/10 hover:border-white/40";
    }
  }

  switch (message.status) {
    case TASK_STATUS_STARTED:
      return "border-white/20 hover:border-white/40";
    case TASK_STATUS_EXECUTING:
      return "border-white/20 hover:border-white/40";
    case TASK_STATUS_COMPLETED:
    case TASK_STATUS_FINAL:
      return "border-green-500 hover:border-green-400";
    default:
      return "";
  }
};

export const getTaskStatusIcon = (
  message: Message,
  config: { [key: string]: string | boolean | undefined }
) => {
  const taskStatusIconClass = "mr-1 mb-1 inline-block";
  const { isAgentStopped } = config;

  switch (message.type) {
    case MESSAGE_TYPE_GOAL:
      return <FaStar className="text-yellow-300" />;
    case MESSAGE_TYPE_ERROR:
      return <FaExclamationTriangle className="text-yellow-400" />;
  }

  if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return <FaThumbtack className={`${taskStatusIconClass} -rotate-45`} />;
  } else if (getTaskStatus(message) === TASK_STATUS_EXECUTING) {
    return isAgentStopped ? (
      <FaStopCircle className={`${taskStatusIconClass}`} />
    ) : (
      <FaCircleNotch className={`${taskStatusIconClass} animate-spin`} />
    );
  } else if (
    getTaskStatus(message) === TASK_STATUS_COMPLETED ||
    getTaskStatus(message) === TASK_STATUS_FINAL
  ) {
    return (
      <FaCheckCircle className={`${taskStatusIconClass} text-green-500 hover:text-green-400`} />
    );
  }
};
