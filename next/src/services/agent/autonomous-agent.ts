import type { Session } from "next-auth";
import { v1 } from "uuid";
import type { Message } from "../../types/message";
import { AgentApi } from "./agent-api";
import { streamText } from "../stream-utils";
import type { Analysis } from "./analysis";
import type { ModelSettings } from "../../types";
import { toApiModelSettings } from "../../utils/interfaces";
import type { MessageService } from "./message-service";
import type { AgentRunModel } from "./agent-run-model";

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

class AutonomousAgent {
  model: AgentRunModel;
  modelSettings: ModelSettings;
  isRunning = false;
  shutdown: () => void;
  session?: Session;
  messageService: MessageService;
  $api: AgentApi;

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

    this.$api = new AgentApi(
      {
        model_settings: toApiModelSettings(modelSettings),
        goal: this.model.getGoal(),
        session,
      },
      this.onApiError
    );
  }

  async run() {
    if (!this.isRunning) {
      this.updateIsRunning(true);
      await this.startGoal();
    }

    await this.loop();
  }

  async startGoal() {
    this.messageService.sendGoalMessage(this.model.getGoal());

    // Initialize by getting taskValues
    try {
      const tasks = await this.$api.getInitialTasks();
      await this.createTasks(tasks);
    } catch (e) {
      console.error(e);
      this.messageService.sendErrorMessage(e);
      this.messageService.sendErrorMessage("ERROR_RETRIEVE_INITIAL_TASKS");
      this.stopAgent();
      return;
    }
  }

  async loop() {
    if (!this.isRunning) {
      this.stopAgent();
      return;
    }

    let currentTask = this.model.getCurrentTask();
    if (currentTask === undefined) {
      this.messageService.sendCompletedMessage();
      this.stopAgent();
      return;
    }

    // Wait before starting TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));
    currentTask = this.model.updateTaskStatus(currentTask, "executing");

    // Analyze how to execute a task: Reason, web search, other tools...

    let analysis: Analysis;
    try {
      analysis = await this.$api.analyzeTask(currentTask.value);
    } catch (e) {
      console.error(e);
      this.messageService.sendErrorMessage(e);
      this.stopAgent();
      return;
    }

    this.messageService.sendAnalysisMessage(analysis);

    const executionMessage: Message = {
      ...currentTask,
      id: v1(),
      status: "completed",
      info: "Loading...",
    };
    this.messageService.sendMessage({ ...executionMessage, status: "completed" });

    // TODO: this should be moved to the api layer
    await streamText(
      "/api/agent/execute",
      {
        run_id: this.$api.runId,
        goal: this.model.getGoal(),
        task: currentTask.value,
        analysis: analysis,
        model_settings: toApiModelSettings(this.modelSettings),
      },
      this.$api.props.session?.accessToken || "",
      () => {
        executionMessage.info = "";
      },
      (text) => {
        executionMessage.info += text;
        this.messageService.updateMessage(executionMessage);
      },
      (error) => {
        this.messageService.sendErrorMessage(error);
      },
      () => !this.isRunning
    );

    this.model.updateTaskStatus(currentTask, "completed");

    // Wait before adding tasks TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Add new tasks
    try {
      const newTasks = await this.$api.getAdditionalTasks(
        {
          current: currentTask.value,
          remaining: this.model.getRemainingTasks().map((task) => task.value),
          completed: this.model.getCompletedTasks(),
        },
        executionMessage.info || ""
      );
      await this.createTasks(newTasks);
      if (newTasks.length == 0) {
        this.messageService.sendMessage({ ...currentTask, status: "final" });
      }
    } catch (e) {
      console.error(e);
      this.messageService.sendMessage({ ...currentTask, status: "final" });
    }

    await this.loop();
  }

  updateIsRunning(isRunning: boolean) {
    this.messageService.setIsRunning(isRunning);
    this.isRunning = isRunning;
  }

  manuallyStopAgent() {
    this.messageService.sendManualShutdownMessage();
    this.stopAgent();
  }

  stopAgent() {
    this.updateIsRunning(false);
    this.shutdown();
    return;
  }

  private onApiError = (e: unknown) => {
    // TODO: handle retries here
    throw e;
  };

  private async createTasks(tasks: string[]) {
    for (const value of tasks) {
      this.messageService.startTask(value);
      this.model.addTask(value);
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
    }
  }
}

export default AutonomousAgent;
