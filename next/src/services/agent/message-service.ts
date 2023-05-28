import type { Message } from "../../types/agentTypes";
import {
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_SYSTEM,
  MESSAGE_TYPE_THINKING,
} from "../../types/agentTypes";
import { translate } from "../../utils/translate";
import type { Analysis } from "./analysis";

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
      this.renderMessage(message);
    }
  }

  sendGoalMessage(goal: string) {
    this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: goal });
  }

  sendLoopMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate("DEMO_LOOPS_REACHED", "errors"),
    });
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
    let message = `⏰ ${translate("GENERATING_RESPONSE", "messageService")}`;
    if (analysis.action == "search") {
      message = `🔍 ${translate("SEARCHING_FOR_THE_WEB", "messageService")} "${analysis.arg}"...}`;
    }
    if (analysis.action == "wikipedia") {
      message = `🌐 ${translate("SEARCHING_WIKIPEDIA", "messageService")} "${analysis.arg}"...`;
    }
    if (analysis.action == "image") {
      message = `🎨 ${translate("GENERTING_IMAGE", "messageService")}: "${analysis.arg}"...`;
    }
    if (analysis.action == "code") {
      message = `💻 ${translate("WRITING_CODE", "messageService")}`;
    }

    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: message,
    });
  }

  sendThinkingMessage() {
    this.sendMessage({ type: MESSAGE_TYPE_THINKING, value: "" });
  }

  sendErrorMessage(error: string) {
    this.sendMessage({ type: MESSAGE_TYPE_SYSTEM, value: error });
  }
}

export default MessageService;
