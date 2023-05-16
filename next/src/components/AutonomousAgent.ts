import axios from "axios";
import type { ModelSettings } from "../utils/types";
import type { Analysis } from "../services/agent-service";
import { DEFAULT_MAX_LOOPS_CUSTOM_API_KEY, DEFAULT_MAX_LOOPS_FREE } from "../utils/constants";
import type { Session } from "next-auth";
import { env } from "../env/client.mjs";
import { v1, v4 } from "uuid";
import type { RequestBody } from "../utils/interfaces";
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

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

interface AutonomousAgentCallbacks {
  onMessage: (message: Message) => void;
  onPause: () => void;
  onShutdown: () => void;
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
    this.sendGoalMessage();
    this.sendThinkingMessage();

    // Initialize by getting taskValues
    try {
      const taskValues = await this.getInitialTasks();
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
      analysis = await this.analyzeTask(currentTask.value);
      this.sendAnalysisMessage(analysis);
    }

    const result = await this.executeTask(currentTask.value, analysis);
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
      const newTasks = await this.getAdditionalTasks(currentTask.value, result);
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

  async getInitialTasks(): Promise<string[]> {
    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
    };
    const res = await this.post(`${env.NEXT_PUBLIC_BACKEND_URL}/api/agent/start`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.newTasks as string[];
  }

  async getAdditionalTasks(currentTask: string, result: string): Promise<string[]> {
    const taskValues = this.getRemainingTasks().map((task) => task.value);

    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
      lastTask: currentTask,
      tasks: taskValues,
      result: result,
      completedTasks: this.completedTasks,
    };
    console.log(data);
    const res = await this.post(`${env.NEXT_PUBLIC_BACKEND_URL}/api/agent/create`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return res.data.newTasks as string[];
  }

  async analyzeTask(task: string): Promise<Analysis> {
    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
      task: task,
    };
    const res = await this.post(`${env.NEXT_PUBLIC_BACKEND_URL}/api/agent/analyze`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data as Analysis;
  }

  async executeTask(task: string, analysis: Analysis): Promise<string> {
    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
      task: task,
      analysis: analysis,
    };
    const res = await this.post(`${env.NEXT_PUBLIC_BACKEND_URL}/api/agent/execute`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.response as string;
  }

  private _shutdownInternal(finalMessage: () => void) {
    finalMessage();
    this._hasShutdown = true;
    this.callbacks.onShutdown();
  }

  private async post(url: string, data: RequestBody) {
    try {
      return await axios.post(url, data);
    } catch (e) {
      this.callbacks.onShutdown();

      if (axios.isAxiosError(e) && e.response?.status === 429) {
        this.sendErrorMessage(translate("RATE_LIMIT_EXCEEDED", "errors"));
      }

      throw e;
    }
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
}

const testConnection = async (modelSettings: ModelSettings) => {
  // A dummy connection to see if the key is valid
  // Can't use LangChain / OpenAI libraries to test because they have retries in place
  return await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: modelSettings.customModelName,
      messages: [{ role: "user", content: "Say this is a test" }],
      max_tokens: 7,
      temperature: 0,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${modelSettings.customApiKey ?? ""}`,
      },
    }
  );
};

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
