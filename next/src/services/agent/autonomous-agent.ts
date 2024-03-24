import type { Session } from "next-auth";

import type { AgentApi } from "./agent-api";
import type { AgentRunModel } from "./agent-run-model";
import type AgentWork from "./agent-work/agent-work";
import AnalyzeTaskWork from "./agent-work/analyze-task-work";
import ChatWork from "./agent-work/chat-work";
import StartGoalWork from "./agent-work/start-task-work";
import SummarizeWork from "./agent-work/summarize-work";
import type { MessageService } from "./message-service";
import { useAgentStore } from "../../stores";
import type { ModelSettings } from "../../types";
import { isRetryableError } from "../../types/errors";
import type { Message } from "../../types/message";
import { withRetries } from "../api-utils";

class AutonomousAgent {
  model: AgentRunModel;
  modelSettings: ModelSettings;
  session?: Session;
  messageService: MessageService;
  api: AgentApi;

  private readonly workLog: AgentWork[];
  private lastConclusion?: () => Promise<void>;

  constructor(
    model: AgentRunModel,
    messageService: MessageService,
    modelSettings: ModelSettings,
    api: AgentApi,
    session?: Session
  ) {
    this.model = model;
    this.messageService = messageService;
    this.modelSettings = modelSettings;
    this.session = session;
    this.api = api;
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
      await this.runWork(work, () => this.model.getLifecycle() === "stopped");

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
    this.stopAgent();
  }

  /*
   * Runs a provided work object with error handling and retries
   */
  private async runWork(work: AgentWork, shouldStop: () => boolean = () => false) {
    const RETRY_TIMEOUT = 2000;

    await withRetries(
      async () => {
        if (shouldStop()) return;
        await work.run();
      },
      async (e) => {
        const shouldRetry = work.onError?.(e) || true;

        if (!isRetryableError(e)) {
          this.stopAgent();
          return false;
        }

        if (shouldRetry) {
          // Wait a bit before retrying
          useAgentStore.getState().setIsAgentThinking(true);
          await new Promise((r) => setTimeout(r, RETRY_TIMEOUT));
        }

        return shouldRetry;
      }
    );
    useAgentStore.getState().setIsAgentThinking(false);
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
    return;
  }

  async summarize() {
    this.model.setLifecycle("running");
    const summarizeWork = new SummarizeWork(this);
    await this.runWork(summarizeWork);
    await summarizeWork.conclude();
    this.model.setLifecycle("stopped");
  }

  async chat(message: string) {
    if (this.model.getLifecycle() == "running") this.pauseAgent();
    let paused = false;
    if (this.model.getLifecycle() == "stopped") {
      paused = true;
      this.model.setLifecycle("pausing");
    }
    const chatWork = new ChatWork(this, message);
    await this.runWork(chatWork);
    await chatWork.conclude();
    if (paused) {
      this.model.setLifecycle("stopped");
    }
  }

  async createTaskMessages(tasks: string[]) {
    const TIMOUT_SHORT = 150;
    const messages: Message[] = [];

    for (const value of tasks) {
      messages.push(this.messageService.startTask(value));
      this.model.addTask(value);
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
    }

    return messages;
  }
}

export default AutonomousAgent;
