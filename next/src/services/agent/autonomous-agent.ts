import type { ModelSettings } from "../../utils/types";
import type { Session } from "next-auth";
import { v1, v4 } from "uuid";
import type { AgentMode, AgentPlaybackControl, Message, Task } from "../../types/agentTypes";
import { AGENT_PAUSE, AGENT_PLAY, AUTOMATIC_MODE, PAUSE_MODE } from "../../types/agentTypes";
import { useMessageStore } from "../../stores";
import { AgentApi } from "./agent-api";
import MessageService from "./message-service";
import { streamText } from "../stream-utils";
import type { Analysis } from "./analysis";

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

class AutonomousAgent {
  name: string;
  goal: string;
  completedTasks: string[] = [];
  modelSettings: ModelSettings;
  isRunning = false;
  renderMessage: (message: Message) => void;
  handlePause: (opts: { agentPlaybackControl?: AgentPlaybackControl }) => void;
  shutdown: () => void;
  session?: Session;
  _id: string;
  mode: AgentMode;
  playbackControl: AgentPlaybackControl;
  messageService: MessageService;
  $api: AgentApi;

  constructor(
    name: string,
    goal: string,
    renderMessage: (message: Message) => void,
    handlePause: (opts: { agentPlaybackControl?: AgentPlaybackControl }) => void,
    shutdown: () => void,
    modelSettings: ModelSettings,
    mode: AgentMode,
    session?: Session,
    playbackControl?: AgentPlaybackControl
  ) {
    this.name = name;
    this.goal = goal;
    this.renderMessage = renderMessage;
    this.handlePause = handlePause;
    this.shutdown = shutdown;
    this.modelSettings = modelSettings;
    this.session = session;
    this._id = v4();
    this.mode = mode || AUTOMATIC_MODE;
    this.playbackControl = playbackControl || this.mode == PAUSE_MODE ? AGENT_PAUSE : AGENT_PLAY;

    this.messageService = new MessageService(renderMessage);

    this.$api = new AgentApi(
      {
        goal,
        modelSettings,
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
    if (this.mode === PAUSE_MODE && !this.isRunning) {
      this.handlePause({ agentPlaybackControl: this.playbackControl });
    }
  }

  async startGoal() {
    this.messageService.sendGoalMessage(this.goal);
    this.messageService.sendThinkingMessage();

    // Initialize by getting taskValues
    try {
      const tasks = await this.$api.getInitialTasks();
      await this.createTasks(tasks);
    } catch (e) {
      console.error(e);
      this.messageService.sendErrorMessage(e);
      this.shutdown();
      return;
    }
  }

  async loop() {
    this.conditionalPause();

    if (!this.isRunning) {
      return;
    }

    if (this.getRemainingTasks().length === 0) {
      this.messageService.sendCompletedMessage();
      this.shutdown();
      return;
    }

    // Wait before starting TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Start with first task
    const currentTask = this.getRemainingTasks()[0] as Task;

    this.messageService.sendMessage({ ...currentTask, status: "executing" });
    this.messageService.sendThinkingMessage();

    // Analyze how to execute a task: Reason, web search, other tools...

    let analysis: Analysis;
    try {
      analysis = await this.$api.analyzeTask(currentTask.value);
    } catch (e) {
      console.error(e);
      this.messageService.sendErrorMessage(e);
      this.shutdown();
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
        modelSettings: this.modelSettings,
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
        this.shutdown();
      },
      () => !this.isRunning
    );

    this.completedTasks.push(currentTask.value || "");

    // Wait before adding tasks TODO: think about removing this
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));
    this.messageService.sendThinkingMessage();

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

  private conditionalPause() {
    if (this.mode != PAUSE_MODE) {
      return;
    }

    // decide whether to pause agent when pause mode is enabled
    this.isRunning = !(this.playbackControl === AGENT_PAUSE);

    // reset playbackControl to pause so agent pauses on next set of task(s)
    if (this.playbackControl === AGENT_PLAY) {
      this.playbackControl = AGENT_PAUSE;
    }
  }

  updatePlayBackControl(newPlaybackControl: AgentPlaybackControl) {
    this.playbackControl = newPlaybackControl;
  }

  updateIsRunning(isRunning: boolean) {
    this.messageService.setIsRunning(isRunning);
    this.isRunning = isRunning;
  }

  stopAgent() {
    this.messageService.sendManualShutdownMessage();
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
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
      this.messageService.sendMessage({
        taskId: v1().toString(),
        value,
        status: "started",
        type: "task",
      });
    }
  }
}

export default AutonomousAgent;
