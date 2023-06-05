import type { Message } from "../../types/agentTypes";
import {
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_SYSTEM,
  MESSAGE_TYPE_THINKING,
} from "../../types/agentTypes";
import { translate } from "../../utils/translations";
import type { Analysis } from "./analysis";
import axios from "axios";
import { isPlatformError } from "../../types/errors";
import { useMessageStore } from "../../stores";

class MessageService {
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

  sendGoalMessage(goal: string) {
    this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: goal });
  }

  sendManualShutdownMessage() {
    this.sendMessage({
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

  sendThinkingMessage() {
    this.sendMessage({ type: MESSAGE_TYPE_THINKING, value: "" });
  }

  sendErrorMessage(e: unknown) {
    let message = "ERROR_RETRIEVE_INITIAL_TASKS";

    if (typeof e == "string") message = e;
    else if (axios.isAxiosError(e) && !e.response) {
      message = "Unable to connect to th Python backend. Please make sure its running.";
    } else if (axios.isAxiosError(e)) {
      switch (e.response?.status) {
        case 409:
          const data = (e.response?.data as object) || {};
          message = isPlatformError(data)
            ? data.detail
            : "An Unknown Error Occurred, Please Try Again!";
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

export default MessageService;
