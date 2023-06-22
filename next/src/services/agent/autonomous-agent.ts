import type { Session } from "next-auth";
import { v1 } from "uuid";
import type { Message } from "../../types/message";
import { AgentApi, withRetries } from "./agent-api";
import { streamText } from "../stream-utils";
import type { Analysis } from "./analysis";
import type { ModelSettings } from "../../types";
import { toApiModelSettings } from "../../utils/interfaces";
import type { MessageService } from "./message-service";
import type { AgentRunModel } from "./agent-run-model";
import type { Task } from "../../types/task";

class AutonomousAgent {
  model: AgentRunModel;
  modelSettings: ModelSettings;
  isRunning = false;
  shutdown: () => void;
  session?: Session;
  messageService: MessageService;
  $api: AgentApi;

  private readonly workLog: AgentWork[];

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

    this.workLog = [new this.startGoalWork(this)];
  }

  async run() {
    this.setIsRunning(true);

    this.addTasksIfWorklogEmpty();
    while (this.workLog[0]) {
      // No longer running, dip
      if (!this.isRunning) return;

      // Get and run the next work item
      const work = this.workLog[0];
      await withRetries(
        async () => {
          await work.run();
        },
        async () => {
          if (this.isRunning) {
            await work.conclude();
          }
        },
        (e) => {
          return work.onError?.(e) || false;
        }
      );
      this.workLog.pop();

      // Add next thing if available
      const next = work.next();
      if (next) {
        this.workLog.push(next);
      }

      this.addTasksIfWorklogEmpty();
    }

    // Done with everything in the log and all queued tasks
    this.messageService.sendCompletedMessage();
    this.stopAgent();
  }

  addTasksIfWorklogEmpty = () => {
    // No work items, check if we still have tasks
    const currentTask = this.model.getCurrentTask();
    if (currentTask) {
      this.workLog.push(new this.analyzeTaskWork(this, currentTask));
    }
  };

  startGoalWork = class StartGoalWork implements AgentWork {
    tasksValues: string[] = [];

    constructor(private parent: AutonomousAgent) {}

    run = async () => {
      this.parent.messageService.sendGoalMessage(this.parent.model.getGoal());
      this.tasksValues = await this.parent.$api.getInitialTasks();
    };

    conclude = async () => {
      await this.parent.createTasks(this.tasksValues);
    };

    onError = (e: unknown): boolean => {
      this.parent.messageService.sendErrorMessage(e);
      return false;
    };

    next = () => undefined;
  };

  analyzeTaskWork = class AnalyzeTaskWork implements AgentWork {
    analysis: Analysis | undefined = undefined;

    constructor(private parent: AutonomousAgent, private task: Task) {}

    run = async () => {
      this.task = this.parent.model.updateTaskStatus(this.task, "executing");
      this.analysis = await this.parent.$api.analyzeTask(this.task.value);
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    conclude = async () => {
      if (!this.analysis) return;
      this.parent.messageService.sendAnalysisMessage(this.analysis);
    };

    next = () => {
      if (!this.analysis) return undefined;
      return new this.parent.executeTaskWork(this.parent, this.task, this.analysis);
    };

    onError = (e: unknown): boolean => {
      this.parent.messageService.sendErrorMessage(e);
      return false;
    };
  };

  executeTaskWork = class ExecuteTaskWork implements AgentWork {
    result = "";

    constructor(private parent: AutonomousAgent, private task: Task, private analysis: Analysis) {}

    run = async () => {
      const executionMessage: Message = {
        ...this.task,
        id: v1(),
        status: "completed",
        info: "Loading...",
      };
      this.parent.messageService.sendMessage({ ...executionMessage, status: "completed" });

      // TODO: this should be moved to the api layer
      await streamText(
        "/api/agent/execute",
        {
          run_id: this.parent.$api.runId,
          goal: this.parent.model.getGoal(),
          task: this.task.value,
          analysis: this.analysis,
          model_settings: toApiModelSettings(this.parent.modelSettings),
        },
        this.parent.$api.props.session?.accessToken || "",
        () => {
          executionMessage.info = "";
        },
        (text) => {
          executionMessage.info += text;
          this.parent.messageService.updateMessage(executionMessage);
        },
        (error) => {
          this.parent.messageService.sendErrorMessage(error);
        },
        () => !this.parent.isRunning
      );
      this.result = executionMessage.info || "";
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    conclude = async () => {
      this.parent.model.updateTaskStatus(this.task, "completed");
      this.parent.messageService.sendMessage({ ...this.task, status: "final" });
    };

    next = () => {
      if (!this.result) return undefined;
      return new this.parent.createTaskWork(this.parent, this.task, "");
    };

    onError = (e: unknown): boolean => {
      this.parent.messageService.sendErrorMessage(e);
      return false;
    };
  };

  createTaskWork = class CreateTaskWork implements AgentWork {
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

    onError = (): boolean => {
      return true;
    };
  };

  setIsRunning(isRunning: boolean) {
    this.isRunning = isRunning;
  }

  manuallyStopAgent() {
    this.messageService.sendManualShutdownMessage();
    this.stopAgent();
  }

  stopAgent() {
    this.setIsRunning(false);
    this.shutdown();
    return;
  }

  private onApiError = (e: unknown) => {
    // TODO: handle retries here
    throw e;
  };

  private async createTasks(tasks: string[]) {
    const TIMOUT_SHORT = 150;

    for (const value of tasks) {
      this.messageService.startTask(value);
      this.model.addTask(value);
      await new Promise((r) => setTimeout(r, TIMOUT_SHORT));
    }
  }
}

interface AgentWork {
  run: () => Promise<void>;
  conclude: () => Promise<void>;
  next: () => AgentWork | undefined;
  onError?: (e: unknown) => boolean;
}

export default AutonomousAgent;
