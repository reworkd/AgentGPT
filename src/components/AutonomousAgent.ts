import axios from "axios";
import type { ModelSettings } from "../utils/types";
import AgentService from "../services/agent-service";
import {
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
  DEFAULT_MAX_LOOPS_PAID,
} from "../utils/constants";
import type { Session } from "next-auth";
import { env } from "../env/client.mjs";
import { v4, v1 } from "uuid";
import type { RequestBody } from "../utils/interfaces";
import {
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  MESSAGE_TYPE_TASK,
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_THINKING,
  MESSAGE_TYPE_SYSTEM,
} from "../types/agentTypes";
import type { Message, Task } from "../types/agentTypes";
import { i18n } from "next-i18next";

const TIMEOUT_LONG = 1000;
const TIMOUT_SHORT = 800;

class AutonomousAgent {
  name: string;
  goal: string;
  language: string;
  tasks: Message[] = [];
  completedTasks: string[] = [];
  modelSettings: ModelSettings;
  isRunning = true;
  renderMessage: (message: Message) => void;
  shutdown: () => void;
  numLoops = 0;
  session?: Session;
  _id: string;

  constructor(
    name: string,
    goal: string,
    language: string,
    renderMessage: (message: Message) => void,
    shutdown: () => void,
    modelSettings: ModelSettings,
    session?: Session
  ) {
    this.name = name;
    this.goal = goal;
    this.language = language;
    this.renderMessage = renderMessage;
    this.shutdown = shutdown;
    this.modelSettings = modelSettings;
    this.session = session;
    this._id = v4();
  }

  async run() {
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
        this.tasks.push(task);
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(getMessageFromError(e));
      this.shutdown();
      return;
    }

    await this.loop();
  }

  async loop() {
    console.log(
      `${i18n?.t("LOOP", "LOOP", { ns: "common" })}: ${this.numLoops}`
    );
    console.log(this.tasks);

    if (!this.isRunning) {
      return;
    }

    if (this.tasks.length === 0) {
      this.sendCompletedMessage();
      this.shutdown();
      return;
    }

    this.numLoops += 1;
    const maxLoops = this.maxLoops();
    if (this.numLoops > maxLoops) {
      this.sendLoopMessage();
      this.shutdown();
      return;
    }

    // Wait before starting
    await new Promise((r) => setTimeout(r, TIMEOUT_LONG));

    // Execute first task
    // Get and remove first task
    this.completedTasks.push(this.tasks[0]?.value || "");

    const currentTask = this.tasks.shift() as Task;
    this.sendThinkingMessage();
    currentTask.status = TASK_STATUS_EXECUTING;
    this.sendMessage(currentTask);

    const result = await this.executeTask(currentTask.value);

    currentTask.status = TASK_STATUS_COMPLETED;
    currentTask.info = result;
    this.sendMessage(currentTask);

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
        this.tasks.push(task);
        this.sendMessage(task);
      }

      if (newTasks.length == 0) {
        currentTask.status = TASK_STATUS_FINAL;
        this.sendMessage(currentTask);
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(
        `${i18n?.t(
          "ERROR_ADDING_ADDITIONAL_TASKS",
          "ERROR_ADDING_ADDITIONAL_TASKS",
          { ns: "errors" }
        )}`
      );
      currentTask.status = TASK_STATUS_FINAL;
      this.sendMessage(currentTask);
    }

    await this.loop();
  }

  private maxLoops() {
    const defaultLoops = !!this.session?.user.subscriptionId
      ? DEFAULT_MAX_LOOPS_PAID
      : DEFAULT_MAX_LOOPS_FREE;

    return !!this.modelSettings.customApiKey
      ? this.modelSettings.customMaxLoops || DEFAULT_MAX_LOOPS_CUSTOM_API_KEY
      : defaultLoops;
  }

  async getInitialTasks(): Promise<string[]> {
    if (this.shouldRunClientSide()) {
      if (!env.NEXT_PUBLIC_FF_MOCK_MODE_ENABLED) {
        await testConnection(this.modelSettings);
      }
      return await AgentService.startGoalAgent(
        this.modelSettings,
        this.goal,
        this.language
      );
    }

    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
    };
    const res = await this.post(`/api/agent/start`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.newTasks as string[];
  }

  async getAdditionalTasks(
    currentTask: string,
    result: string
  ): Promise<string[]> {
    const taskValues = this.tasks.map((task) => task.value);

    if (this.shouldRunClientSide()) {
      return await AgentService.createTasksAgent(
        this.modelSettings,
        this.goal,
        taskValues,
        currentTask,
        result,
        this.language,
        this.completedTasks
      );
    }

    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
      tasks: taskValues,
      lastTask: currentTask,
      result: result,
      completedTasks: this.completedTasks,
    };
    const res = await this.post(`/api/agent/create`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return res.data.newTasks as string[];
  }

  async executeTask(task: string): Promise<string> {
    if (this.shouldRunClientSide()) {
      return await AgentService.executeTaskAgent(
        this.modelSettings,
        this.goal,
        task,
        this.language
      );
    }

    const data = {
      modelSettings: this.modelSettings,
      goal: this.goal,
      language: this.language,
      task: task,
    };
    const res = await this.post("/api/agent/execute", data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.response as string;
  }

  private async post(url: string, data: RequestBody) {
    try {
      return await axios.post(url, data);
    } catch (e) {
      this.shutdown();

      if (axios.isAxiosError(e) && e.response?.status === 429) {
        this.sendErrorMessage(
          `${i18n?.t("RATE_LIMIT_EXCEEDED", "RATE_LIMIT_EXCEEDED", {
            ns: "errors",
          })}`
        );
      }

      throw e;
    }
  }

  private shouldRunClientSide() {
    return !!this.modelSettings.customApiKey;
  }

  stopAgent() {
    this.sendManualShutdownMessage();
    this.isRunning = false;
    this.shutdown();
    return;
  }

  sendMessage(message: Message) {
    if (this.isRunning) {
      this.renderMessage(message);
    }
  }

  sendGoalMessage() {
    this.sendMessage({ type: MESSAGE_TYPE_GOAL, value: this.goal });
  }

  sendLoopMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: !!this.modelSettings.customApiKey
        ? `${i18n?.t("AGENT_MAXED_OUT_LOOPS", "AGENT_MAXED_OUT_LOOPS", {
            ns: "errors",
          })}`
        : `${i18n?.t("DEMO_LOOPS_REACHED", "DEMO_LOOPS_REACHED", {
            ns: "errors",
          })}`,
    });
  }

  sendManualShutdownMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: `${i18n?.t(
        "AGENT_MANUALLY_SHUT_DOWN",
        "AGENT_MANUALLY_SHUT_DOWN",
        { ns: "errors" }
      )}`,
    });
  }

  sendCompletedMessage() {
    this.sendMessage({
      type: MESSAGE_TYPE_SYSTEM,
      value: `${i18n?.t("ALL_TASKS_COMPLETETD", "ALL_TASKS_COMPLETETD", {
        ns: "errors",
      })}`,
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
  let message = `${i18n?.t(
    "ERROR_ACCESSING_OPENAI_API_KEY",
    "ERROR_ACCESSING_OPENAI_API_KEY",
    { ns: "errors" }
  )}`;
  if (axios.isAxiosError(e)) {
    const axiosError = e;
    if (axiosError.response?.status === 429) {
      message = `${i18n?.t("ERROR_API_KEY_QUOTA", "ERROR_API_KEY_QUOTA", {
        ns: "errors",
      })}`;
    }
    if (axiosError.response?.status === 404) {
      message = `${i18n?.t(
        "ERROR_OPENAI_API_KEY_NO_GPT4",
        "ERROR_OPENAI_API_KEY_NO_GPT4",
        { ns: "errors" }
      )}`;
    }
  } else {
    message = `${i18n?.t(
      "ERROR_RETRIEVE_INITIAL_TASKS",
      "ERROR_RETRIEVE_INITIAL_TASKS",
      { ns: "errors" }
    )}`;
  }
  return message;
};

export default AutonomousAgent;
