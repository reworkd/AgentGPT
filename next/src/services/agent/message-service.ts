import axios from "axios";
import { v1 } from "uuid";

import type { Analysis } from "./analysis";
import { useMessageStore } from "../../stores";
import { isPlatformError, isValueError } from "../../types/errors";
import type { Message } from "../../types/message";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_SYSTEM } from "../../types/message";
import type { Task } from "../../types/task";
import { translate } from "../../utils/translations";

export class MessageService {
  private readonly renderMessage: (message: Message) => void;

  constructor(renderMessage: (message: Message) => void) {
    this.renderMessage = renderMessage;
  }

  sendMessage = (message: Message): Message => {
    this.renderMessage({ ...message });
    return message;
  };

  updateMessage = (message: Message): Message => {
    useMessageStore.getState().updateMessage(message);
    return message;
  };

  skipTaskMessage = (task: Task) =>
    this.sendMessage({
      type: "system",
      value: `🥺 Skipping task: ${task.value}`,
    });

  startTask = (task: string) =>
    this.sendMessage({
      taskId: v1().toString(),
      value: task,
      status: "started",
      type: "task",
    });

  sendGoalMessage = (goal: string) => this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: goal });

  sendAnalysisMessage = (analysis: Analysis) => {
    let message = "⏰ Generating response...";
    if (analysis.action == "search") {
      message = `🔍 Searching the web for "${analysis.arg}"...`;
    }
    if (analysis.action == "wikipedia") {
      message = `🌐 Searching Wikipedia for "${analysis.arg}"...`;
    }
    if (analysis.action == "image") {
      message = `🎨 Generating an image with prompt: "${analysis.arg}"...`;
    }
    if (analysis.action == "code") {
      message = `💻 Writing code...`;
    }

    return this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: message,
    });
  };

  sendErrorMessage = (e: unknown) => {
    let message = "An unknown error occurred. Please try again later.";
    if (typeof e == "string") message = e;
    else if (axios.isAxiosError(e) && e.message == "Network Error") {
      message = "Error attempting to connect to the server.";
    } else if (axios.isAxiosError(e)) {
      const data = (e.response?.data as object) || {};
      switch (e.response?.status) {
        case 409:
          message = isPlatformError(data)
            ? data.detail
            : "An Unknown Error Occurred, Please Try Again!";
          break;
        case 422:
          if (isValueError(data)) {
            const detailMessages = data.detail.map((detail) => detail.msg);
            message = detailMessages.join("\n");
          }
          break;
        case 429:
          if (e.response?.data && "detail" in e.response.data) {
            const { detail } = e.response.data as { detail?: string };
            message = detail || "Too many requests. Please try again later.";
          } else {
            message = "Too many requests. Please try again later.";
          }
          break;
        case 403:
          message = "Authentication Error. Please make sure you are logged in.";
          break;
        case 404:
          message = "ERROR_OPENAI_API_KEY_NO_GPT4";
          break;
        default:
          message = "ERROR_ACCESSING_OPENAI_API_KEY";
          break;
      }
    } else if (e instanceof Error) message = e.message;

    return this.sendMessage({ type: "error", value: translate(message, "errors") });
  };
}
