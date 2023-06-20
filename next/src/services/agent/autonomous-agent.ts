import type { Session } from "next-auth";
import { v1, v4 } from "uuid";
import type { Message, Task } from "../../types/agentTypes";
import { useMessageStore } from "../../stores";
import { AgentApi } from "./agent-api";
import { streamText } from "../stream-utils";
import type { Analysis } from "./analysis";
import type { ModelSettings } from "../../types";
import { toApiModelSettings } from "../../utils/interfaces";
import type { MessageService } from "./message-service";

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

class AutonomousAgent {
  name: string;
  goal: string;
  completedTasks: string[] = [];
  modelSettings: ModelSettings;
  isRunning = false;
  shutdown: () => void;
  session?: Session;
  _id: string;
  messageService: MessageService;
  $api: AgentApi;

  constructor(
    name: string,
    goal: string,
    messageService: MessageService,
    shutdown: () => void,
    modelSettings: ModelSettings,
    session?: Session
  ) {
    this.name = name;
    this.goal = goal;
    this.messageService = messageService;
    this.shutdown = shutdown;
    this.modelSettings = modelSettings;
    this.session = session;
    this._id = v4();

    this.$api = new AgentApi(
      {
        model_settings: toApiModelSettings(modelSettings),
        goal,
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
    this.messageService.sendGoalMessage(this.goal);

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

    if (this.getRemainingTasks().length === 0) {
      this.messageService.sendCompletedMessage();
      this.stopAgent();
      return;
    }

    // Wait before starting TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Start with first task
    const currentTask = this.getRemainingTasks()[0] as Task;

    this.messageService.sendMessage({ ...currentTask, status: "executing" });

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
        goal: this.goal,
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
        this.stopAgent();
      },
      () => !this.isRunning
    );

    this.completedTasks.push(currentTask.value || "");

    // Wait before adding tasks TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Add new tasks
    try {
      const newTasks = await this.$api.getAdditionalTasks(
        {
          current: currentTask.value,
          remaining: this.getRemainingTasks().map((task) => task.value),
          completed: this.completedTasks,
        },
        executionMessage.info || ""
      );
      await this.createTasks(newTasks);
      if (newTasks.length == 0) {
        this.messageService.sendMessage({ ...currentTask, status: "final" });
      }
    } catch (e) {
      console.error(e);
      this.messageService.sendErrorMessage("ERROR_ADDING_ADDITIONAL_TASKS");
      this.messageService.sendMessage({ ...currentTask, status: "final" });
    }

    await this.loop();
  }

  getRemainingTasks(): Task[] {
    return useMessageStore.getState().tasks.filter((t: Task) => t.status === "started");
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
    this.shutdown();
    throw e;
  };

  private async createTasks(tasks: string[]) {
    for (const value of tasks) {
      this.messageService.sendMessage({
        taskId: v1().toString(),
        value,
        status: "started",
        type: "task",
      });
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
    }
  }
}

export default AutonomousAgent;
