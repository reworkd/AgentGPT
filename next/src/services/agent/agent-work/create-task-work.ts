import type AgentWork from "./agent-work";
import type { Task } from "../../../types/task";
import type AutonomousAgent from "../autonomous-agent";

export default class CreateTaskWork implements AgentWork {
  taskValues: string[] = [];

  constructor(private parent: AutonomousAgent, private task: Task) {}

  run = async () => {
    this.taskValues = await this.parent.api.getAdditionalTasks(
      {
        current: this.task.value,
        remaining: this.parent.model.getRemainingTasks().map((task) => task.value),
        completed: this.parent.model.getCompletedTasks().map((task) => task.value),
      },
      this.task.result || ""
    );
  };

  conclude = async () => {
    const TIMEOUT_LONG = 1000;
    this.parent.api.saveMessages(await this.parent.createTaskMessages(this.taskValues));
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));
  };

  next = () => undefined;

  // Ignore errors and simply avoid creating more tasks
  onError = (): boolean => false;
}
