import { v1 } from "uuid";

import type AgentWork from "./agent-work";
import type { Message } from "../../../types/message";
import type { Task } from "../../../types/task";
import { toApiModelSettings } from "../../../utils/interfaces";
import { streamText } from "../../stream-utils";
import type { Analysis } from "../analysis";
import type AutonomousAgent from "../autonomous-agent";

export default class ExecuteTaskWork implements AgentWork {
  result = "";

  constructor(private parent: AutonomousAgent, private task: Task, private analysis: Analysis) {}

  run = async () => {
    const executionMessage: Message = {
      ...this.task,
      id: v1(),
      status: "completed",
      info: "Loading...",
    };
    this.parent.messageService.sendMessage({ ...executionMessage, status: "completed" });

    // TODO: this should be moved to the api layer
    await streamText(
      "/api/agent/execute",
      {
        run_id: this.parent.api.runId,
        goal: this.parent.model.getGoal(),
        task: this.task.value,
        analysis: this.analysis,
        model_settings: toApiModelSettings(this.parent.modelSettings, this.parent.session),
      },
      this.parent.api.props.session?.accessToken || "",
      () => {
        executionMessage.info = "";
      },
      (text) => {
        executionMessage.info += text;
        this.task = this.parent.model.updateTaskResult(this.task, executionMessage.info || "");
        this.parent.messageService.updateMessage(executionMessage);
      },
      () => this.parent.model.getLifecycle() === "stopped"
    );
    this.result = executionMessage.info || "";
    this.parent.api.saveMessages([executionMessage]);
    this.task = this.parent.model.updateTaskStatus(this.task, "completed");
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  conclude = async () => void 0;

  next = () => undefined;

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return true;
  };
}
