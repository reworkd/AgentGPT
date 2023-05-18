import axios from "axios";
import type { ModelSettings } from "../utils/types";
import type { Analysis } from "../services/agent-service";
import { DEFAULT_MAX_LOOPS_CUSTOM_API_KEY, DEFAULT_MAX_LOOPS_FREE } from "../utils/constants";
import { v1, v4 } from "uuid";
import type { AgentMode, Message, Task } from "../types/agentTypes";
import {
  AUTOMATIC_MODE,
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_SYSTEM,
  MESSAGE_TYPE_TASK,
  MESSAGE_TYPE_THINKING,
  PAUSE_MODE,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../types/agentTypes";
import { useAgentStore, useMessageStore } from "../stores";
import { translate } from "../utils/translations";
import { AgentApi } from "../services/agent-api";
import { Optional } from "../types";

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

interface AutonomousAgentCallbacks {
  onMessage: (message: Message) => void;
  onPause: () => void;
  onShutdown: () => void;
  onStart: () => void;
}

class AutonomousAgent {
  name: string;
  goal: string;
  language: string;
  completedTasks: string[] = [];
  modelSettings: ModelSettings;
  isRunning = false;
  numLoops = 0;
  mode: AgentMode;
  callbacks: AutonomousAgentCallbacks;

  _id: string;
  _hasRun = false;
  _hasShutdown = false;
  _canPause = false;
  $api: AgentApi;

  constructor(
    name: string,
    goal: string,
    language: string,
    modelSettings: ModelSettings,
    mode: AgentMode,
    callbacks: AutonomousAgentCallbacks
  ) {
    this.name = name;
    this.goal = goal;
    this.language = language;
    this.modelSettings = modelSettings;
    this.mode = mode || AUTOMATIC_MODE;
    this.callbacks = callbacks;

    this._id = v4();
    this.$api = new AgentApi(
      {
        goal,
        language,
        modelSettings,
      },
      this.onApiError
    );
  }

  async run() {
    if (!this._hasRun) {
      this._hasRun = true;
      await this.startGoal();
    }

    this.isRunning = true;
    this._canPause = false;
    await this.loop();
  }

  async startGoal() {
    this.callbacks.onStart();
    this.sendGoalMessage();
    this.sendThinkingMessage();

    // Initialize by getting taskValues
    try {
      const taskValues = await this.$api.getInitialTasks();
      for (const value of taskValues) {
        await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
        const task: Task = {
          taskId: v1().toString(),
          value,
          status: TASK_STATUS_STARTED,
          type: MESSAGE_TYPE_TASK,
        };
        this.sendMessage(task);
      }
    } catch (e) {
      return this._shutdownInternal(() => this.sendErrorMessage(getMessageFromError(e)));
    }
  }

  async loop() {
    if (this._hasShutdown) {
      return;
    }

    if (this.mode === PAUSE_MODE && this._canPause) {
      this.callbacks.onPause();
      return;
    }

    this._canPause = true;
    if (this.getRemainingTasks().length === 0) {
      return this._shutdownInternal(() => this.sendCompletedMessage());
    }

    this.numLoops += 1;
    const maxLoops = this.maxLoops();
    if (this.numLoops > maxLoops) {
      return this._shutdownInternal(() => this.sendLoopMessage());
    }

    // Wait before starting
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Start with first task
    const currentTask = this.getRemainingTasks()[0] as Task;
    this.sendMessage({ ...currentTask, status: TASK_STATUS_EXECUTING });

    this.sendThinkingMessage();

    // Default to reasoning
    let analysis: Analysis = { action: "reason", arg: "" };

    // If enabled, analyze what tool to use
    if (useAgentStore.getState().isWebSearchEnabled) {
      // Analyze how to execute a task: Reason, web search, other tools...
      analysis = await this.$api.analyzeTask(currentTask.value);
      this.sendAnalysisMessage(analysis);
    }

    const result = await this.$api.executeTask(currentTask.value, analysis);
    this.sendMessage({
      ...currentTask,
      info: result,
      status: TASK_STATUS_COMPLETED,
    });

    this.completedTasks.push(currentTask.value || "");

    // Wait before adding tasks
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));
    this.sendThinkingMessage();

    // Add new tasks
    try {
      const newTasks = await this.$api.getAdditionalTasks(
        {
          current: currentTask.value,
          remaining: this.getRemainingTasks().map((task) => task.value),
          completed: this.completedTasks,
        },
        result
      );
      for (const value of newTasks) {
        await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
        const task: Task = {
          taskId: v1().toString(),
          value,
          status: TASK_STATUS_STARTED,
          type: MESSAGE_TYPE_TASK,
        };
        this.sendMessage(task);
      }

      if (newTasks.length == 0) {
        this.sendMessage({ ...currentTask, status: TASK_STATUS_FINAL });
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(translate("ERROR_ADDING_ADDITIONAL_TASKS", "errors"));
      this.sendMessage({ ...currentTask, status: TASK_STATUS_FINAL });
    }

    await this.loop();
  }

  getRemainingTasks(): Task[] {
    return useMessageStore.getState().tasks.filter((t: Task) => t.status === TASK_STATUS_STARTED);
  }

  private maxLoops() {
    return !!this.modelSettings.customApiKey
      ? this.modelSettings.customMaxLoops || DEFAULT_MAX_LOOPS_CUSTOM_API_KEY
      : DEFAULT_MAX_LOOPS_FREE;
  }
  stopAgent() {
    return this._shutdownInternal(() => this.sendManualShutdownMessage());
  }

  sendMessage(message: Message) {
    if (!this._hasShutdown) this.callbacks.onMessage(message);
  }

  sendGoalMessage() {
    this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: this.goal });
  }

  sendLoopMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate(
        !!this.modelSettings.customApiKey ? "AGENT_MAXED_OUT_LOOPS" : "DEMO_LOOPS_REACHED",
        "errors"
      ),
    });
  }

  sendManualShutdownMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate("AGENT_MANUALLY_SHUT_DOWN", "errors"),
    });
  }

  sendCompletedMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: translate("ALL_TASKS_COMPLETETD", "errors"),
    });
  }

  sendAnalysisMessage(analysis: Analysis) {
    // Hack to send message with generic test. Should use a different type in the future
    let message = "⏰ Generating response...";
    if (analysis.action == "search") {
      message = `🔍 Searching the web for "${analysis.arg}"...`;
    }
    if (analysis.action == "wikipedia") {
      message = `🌐 Searching Wikipedia for "${analysis.arg}"...`;
    }
    if (analysis.action == "image") {
      message = `🎨 Generating an image with prompt: "${analysis.arg}"...`;
    }

    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: message,
    });
  }

  sendThinkingMessage() {
    this.sendMessage({ type: MESSAGE_TYPE_THINKING, value: "" });
  }

  sendErrorMessage(error: string) {
    this.sendMessage({ type: MESSAGE_TYPE_SYSTEM, value: error });
  }

  private onApiError = (e: unknown) => {
    let message: Optional<() => void> = undefined;

    if (axios.isAxiosError(e) && e.response?.status === 429) {
      message = () => void this.sendErrorMessage(translate("RATE_LIMIT_EXCEEDED", "errors"));
    }

    this._shutdownInternal(message);
    throw e;
  };

  private _shutdownInternal(finalMessage?: () => void) {
    finalMessage?.();
    this._hasShutdown = true;
    this.callbacks.onShutdown();
  }
}

const getMessageFromError = (e: unknown) => {
  let message = "ERROR_RETRIEVE_INITIAL_TASKS";

  if (axios.isAxiosError(e)) {
    if (e.response?.status === 429) message = "ERROR_API_KEY_QUOTA";
    if (e.response?.status === 404) message = "ERROR_OPENAI_API_KEY_NO_GPT4";
    else message = "ERROR_ACCESSING_OPENAI_API_KEY";
  }

  return translate(message, "errors");
};

export default AutonomousAgent;
