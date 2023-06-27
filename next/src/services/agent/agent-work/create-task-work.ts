import type { Task } from "../../../types/task";
import type AgentWork from "./agent-work";
import type AutonomousAgent from "../autonomous-agent";

export default class CreateTaskWork implements AgentWork {
  taskValues: string[] = [];

  constructor(private parent: AutonomousAgent, private task: Task, private result: string) {}

  run = async () => {
    this.taskValues = await this.parent.$api.getAdditionalTasks(
      {
        current: this.task.value,
        remaining: this.parent.model.getRemainingTasks().map((task) => task.value),
        completed: this.parent.model.getCompletedTasks(),
      },
      this.result
    );
  };

  conclude = async () => {
    const TIMEOUT_LONG = 1000;
    await this.parent.createTasks(this.taskValues);
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));
  };

  next = () => undefined;

  // Ignore errors and simply avoid creating more tasks
  onError = (): boolean => true;
}
