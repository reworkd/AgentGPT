import { translate } from "../../utils/translations";
import type { Analysis } from "./analysis";
import axios from "axios";
import { isPlatformError, isValueError } from "../../types/errors";
import { useMessageStore } from "../../stores";
import type { Message } from "../../types/message";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_SYSTEM } from "../../types/message";
import { v1 } from "uuid";

export class MessageService {
  private isRunning: boolean;
  private readonly renderMessage: (message: Message) => void;

  constructor(renderMessage: (message: Message) => void) {
    this.isRunning = false;
    this.renderMessage = renderMessage;
  }

  setIsRunning(isRunning: boolean) {
    this.isRunning = isRunning;
  }

  sendMessage(message: Message) {
    if (this.isRunning) {
      this.renderMessage({ ...message });
    }
  }

  updateMessage(message: Message) {
    if (this.isRunning) {
      useMessageStore.getState().updateMessage(message);
    }
  }

  startTask(task: string) {
    this.renderMessage({
      taskId: v1().toString(),
      value: task,
      status: "started",
      type: "task",
    });
  }

  sendGoalMessage(goal: string) {
    this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: goal });
  }

  sendManualShutdownMessage() {
    this.renderMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate("AGENT_MANUALLY_SHUT_DOWN", "errors"),
    });
  }

  sendCompletedMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate("ALL_TASKS_COMPLETETD", "errors"),
    });
  }

  sendAnalysisMessage(analysis: Analysis) {
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

    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: message,
    });
  }

  sendErrorMessage(e: unknown) {
    let message = "An unknown error occurred. Please try again later.";

    if (typeof e == "string") message = e;
    else if (axios.isAxiosError(e)) {
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
          message = "ERROR_API_KEY_QUOTA";
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
    }

    this.sendMessage({ type: "error", value: translate(message, "errors") });
  }
}
