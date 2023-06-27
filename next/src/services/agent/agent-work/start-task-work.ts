import type AutonomousAgent from "../autonomous-agent";
import type AgentWork from "./agent-work";

export default class StartGoalWork implements AgentWork {
  tasksValues: string[] = [];

  constructor(private parent: AutonomousAgent) {}

  run = async () => {
    this.parent.messageService.sendGoalMessage(this.parent.model.getGoal());
    this.tasksValues = await this.parent.$api.getInitialTasks();
  };

  conclude = async () => {
    await this.parent.createTasks(this.tasksValues);
  };

  onError = (e: unknown): boolean => {
    this.parent.messageService.sendErrorMessage(e);
    return false;
  };

  next = () => undefined;
}
