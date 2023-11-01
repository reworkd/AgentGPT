import type AgentWork from "./agent-work";
import ExecuteTaskWork from "./execute-task-work";
import type { Message } from "../../../types/message";
import type { Task } from "../../../types/task";
import type { Analysis } from "../analysis";
import type AutonomousAgent from "../autonomous-agent";

export default class AnalyzeTaskWork implements AgentWork {
  analysis: Analysis | undefined = undefined;

  constructor(private parent: AutonomousAgent, private task: Task) {}

  run = async () => {
    this.task = this.parent.model.updateTaskStatus(this.task, "executing");
    this.analysis = await this.parent.api.analyzeTask(this.task.value);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  conclude = async () => {
    let message: Message | undefined = undefined;
    if (this.analysis) {
      message = this.parent.messageService.sendAnalysisMessage(this.analysis);
    } else {
      message = this.parent.messageService.skipTaskMessage(this.task);
    }
    this.parent.api.saveMessages([message]);
  };

  next = () => {
    if (!this.analysis) return undefined;
    return new ExecuteTaskWork(this.parent, this.task, this.analysis);
  };

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return true;
  };
}
