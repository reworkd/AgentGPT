import type { Session } from "next-auth";
import { AgentApi, withRetries } from "./agent-api";
import type { ModelSettings } from "../../types";
import { toApiModelSettings } from "../../utils/interfaces";
import type { MessageService } from "./message-service";
import type { AgentRunModel } from "./agent-run-model";
import { useAgentStore } from "../../stores";
import { isRetryableError } from "../../types/errors";
import AnalyzeTaskWork from "./agent-work/analyze-task-work";
import StartGoalWork from "./agent-work/start-task-work";
import type AgentWork from "./agent-work/agent-work";

class AutonomousAgent {
  model: AgentRunModel;
  modelSettings: ModelSettings;
  shutdown: () => void;
  session?: Session;
  messageService: MessageService;
  $api: AgentApi;

  private readonly workLog: AgentWork[];
  private lastConclusion?: () => Promise<void>;

  constructor(
    model: AgentRunModel,
    messageService: MessageService,
    shutdown: () => void,
    modelSettings: ModelSettings,
    session?: Session
  ) {
    this.model = model;
    this.messageService = messageService;
    this.shutdown = shutdown;
    this.modelSettings = modelSettings;
    this.session = session;
    this.$api = new AgentApi({
      model_settings: toApiModelSettings(modelSettings),
      goal: this.model.getGoal(),
      session,
    });

    this.workLog = [new StartGoalWork(this)];
  }

  async run() {
    this.model.setLifecycle("running");

    // If an agent is paused during execution, we need to play work conclusions
    if (this.lastConclusion) {
      await this.lastConclusion();
      this.lastConclusion = undefined;
    }

    this.addTasksIfWorklogEmpty();
    while (this.workLog[0]) {
      // No longer running, dip
      if (this.model.getLifecycle() === "pausing") this.model.setLifecycle("paused");
      if (this.model.getLifecycle() !== "running") return;

      // Get and run the next work item
      const work = this.workLog[0];
      const RETRY_TIMEOUT = 2000;

      await withRetries(
        async () => {
          if (this.model.getLifecycle() === "stopped") return;
          await work.run();
        },
        async (e) => {
          const shouldContinue = work.onError?.(e) || false;

          if (!isRetryableError(e)) {
            this.stopAgent();
            return false;
          }

          if (!shouldContinue) {
            useAgentStore.getState().setIsAgentThinking(true);
            await new Promise((r) => setTimeout(r, RETRY_TIMEOUT));
          }

          return shouldContinue;
        }
      );
      useAgentStore.getState().setIsAgentThinking(false);

      this.workLog.shift();
      if (this.model.getLifecycle() !== "running") {
        this.lastConclusion = () => work.conclude();
      } else {
        await work.conclude();
      }

      // Add next thing if available
      const next = work.next();
      if (next) {
        this.workLog.push(next);
      }

      this.addTasksIfWorklogEmpty();
    }

    if (this.model.getLifecycle() === "pausing") this.model.setLifecycle("paused");
    if (this.model.getLifecycle() !== "running") return;

    // Done with everything in the log and all queued tasks
    this.messageService.sendCompletedMessage();
    this.stopAgent();
  }

  addTasksIfWorklogEmpty = () => {
    if (this.workLog.length > 0) return;

    // No work items, check if we still have tasks
    const currentTask = this.model.getCurrentTask();
    if (currentTask) {
      this.workLog.push(new AnalyzeTaskWork(this, currentTask));
    }
  };

  pauseAgent() {
    this.model.setLifecycle("pausing");
  }

  stopAgent() {
    this.model.setLifecycle("stopped");
    this.shutdown();
    return;
  }

  async createTasks(tasks: string[]) {
    const TIMOUT_SHORT = 150;

    for (const value of tasks) {
      this.messageService.startTask(value);
      this.model.addTask(value);
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
    }
  }
}

export default AutonomousAgent;
