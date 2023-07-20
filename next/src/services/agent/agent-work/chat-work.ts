import { v1 } from "uuid";

import type AgentWork from "./agent-work";
import type { Message } from "../../../types/message";
import { toApiModelSettings } from "../../../utils/interfaces";
import { streamText } from "../../stream-utils";
import type AutonomousAgent from "../autonomous-agent";

export default class ChatWork implements AgentWork {
  constructor(private parent: AutonomousAgent, private message: string) {}

  run = async () => {
    const executionMessage: Message = {
      type: "task",
      status: "completed",
      value: `Response for '${this.message}'`,
      id: v1(),
      info: "Loading...",
    };
    this.parent.messageService.sendMessage({ ...executionMessage });

    // TODO: this should be moved to the api layer
    await streamText(
      "/api/agent/chat",
      {
        run_id: this.parent.api.runId,
        goal: this.parent.model.getGoal(),
        model_settings: toApiModelSettings(this.parent.modelSettings, this.parent.session),
        message: this.message,
        results: this.parent.model
          .getCompletedTasks()
          .filter((task) => task.result && task.result !== "")
          .map((task) => task.result || ""),
      },
      this.parent.api.props.session?.accessToken || "",
      () => {
        executionMessage.info = "";
      },
      (text) => {
        executionMessage.info += text;
        this.parent.messageService.updateMessage(executionMessage);
      },
      () => this.parent.model.getLifecycle() === "stopped"
    );
    this.parent.api.saveMessages([executionMessage]);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  conclude = async () => void 0;

  next = () => undefined;

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return true;
  };
}
