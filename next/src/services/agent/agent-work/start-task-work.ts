import type AgentWork from "./agent-work";
import type AutonomousAgent from "../autonomous-agent";

export default class StartGoalWork implements AgentWork {
  tasksValues: string[] = [];

  constructor(private parent: AutonomousAgent) {}

  run = async () => {
    const goalMessage = this.parent.messageService.sendGoalMessage(this.parent.model.getGoal());
    this.tasksValues = await this.parent.api.getInitialTasks();
    await this.parent.api.createAgent();
    this.parent.api.saveMessages([goalMessage]);
  };

  conclude = async () => {
    const messages = await this.parent.createTaskMessages(this.tasksValues);
    this.parent.api.saveMessages(messages);
  };

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return true;
  };

  next = () => undefined;
}
