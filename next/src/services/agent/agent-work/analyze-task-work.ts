import type { Analysis } from "../analysis";
import type { Task } from "../../../types/task";
import type AutonomousAgent from "../autonomous-agent";
import type AgentWork from "./agent-work";
import ExecuteTaskWork from "./execute-task-work";

export default class AnalyzeTaskWork implements AgentWork {
  analysis: Analysis | undefined = undefined;

  constructor(private parent: AutonomousAgent, private task: Task) {}

  run = async () => {
    this.parent.messageService.startTaskMessage(this.task);
    this.task = this.parent.model.updateTaskStatus(this.task, "executing");
    this.analysis = await this.parent.$api.analyzeTask(this.task.value);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  conclude = async () => {
    if (this.analysis) {
      this.parent.messageService.sendAnalysisMessage(this.analysis);
    } else {
      this.parent.messageService.skipTaskMessage(this.task);
    }
  };

  next = () => {
    if (!this.analysis) return undefined;
    return new ExecuteTaskWork(this.parent, this.task, this.analysis);
  };

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return false;
  };
}
