import type { Message } from "./ChatWindow";
import axios from "axios";

class AutonomousAgent {
  name: string;
  goal: string;
  tasks: string[] = [];
  customApiKey: string;
  isRunning = true;
  sendMessage: (message: Message) => void;
  shutdown: () => void;
  numLoops = 0;

  constructor(
    name: string,
    goal: string,
    addMessage: (message: Message) => void,
    shutdown: () => void,
    customApiKey: string
  ) {
    this.name = name;
    this.goal = goal;
    this.sendMessage = addMessage;
    this.shutdown = shutdown;
    this.customApiKey = customApiKey;
  }

  async run() {
    this.sendGoalMessage();
    this.sendThinkingMessage();

    // Initialize by getting tasks
    try {
      this.tasks = await this.getInitialTasks();
      for (const task of this.tasks) {
        await new Promise((r) => setTimeout(r, 800));
        this.sendTaskMessage(task);
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(
        this.customApiKey !== ""
          ? `ERROR retrieving initial tasks array. Make sure your API key is not the free tier, make your goal more clear, or revise your goal such that it is within our model's policies to run. Shutting Down.`
          : `ERROR retrieving initial tasks array. Retry, make your goal more clear, or revise your goal such that it is within our model's policies to run. Shutting Down.`
      );
      this.shutdown();
      return;
    }

    await this.loop();
  }

  async loop() {
    console.log(`Loop ${this.numLoops}`);
    console.log(this.tasks);

    if (!this.isRunning) {
      this.sendManualShutdownMessage();
      this.shutdown();
      return;
    }

    if (this.tasks.length === 0) {
      this.sendCompletedMessage();
      this.shutdown();
      return;
    }

    this.numLoops += 1;
    const maxLoops = this.customApiKey === "" ? 4 : 25;
    if (this.numLoops > maxLoops) {
      this.sendLoopMessage();
      this.shutdown();
      return;
    }

    // Wait before starting
    await new Promise((r) => setTimeout(r, 1000));

    // Execute first task
    // Get and remove first task
    const currentTask = this.tasks.shift();
    this.sendThinkingMessage();

    const result = await this.executeTask(currentTask as string);
    this.sendExecutionMessage(currentTask as string, result);

    // Wait before adding tasks
    await new Promise((r) => setTimeout(r, 1000));
    this.sendThinkingMessage();

    // Add new tasks
    try {
      const newTasks = await this.getAdditionalTasks(
        currentTask as string,
        result
      );
      this.tasks = this.tasks.concat(newTasks);
      for (const task of newTasks) {
        await new Promise((r) => setTimeout(r, 800));
        this.sendTaskMessage(task);
      }

      if (newTasks.length == 0) {
        this.sendActionMessage("Task marked as complete!");
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(
        `ERROR adding additional task(s). It might have been against our model's policies to run them. Continuing.`
      );
      this.sendActionMessage("Task marked as complete.");
    }

    await this.loop();
  }

  async getInitialTasks(): Promise<string[]> {
    const res = await axios.post(`/api/chain`, {
      customApiKey: this.customApiKey,
      goal: this.goal,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.tasks as string[];
  }

  async getAdditionalTasks(
    currentTask: string,
    result: string
  ): Promise<string[]> {
    const res = await axios.post(`/api/create`, {
      customApiKey: this.customApiKey,
      goal: this.goal,
      tasks: this.tasks,
      lastTask: currentTask,
      result: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return res.data.tasks as string[];
  }

  async executeTask(task: string): Promise<string> {
    const res = await axios.post(`/api/execute`, {
      customApiKey: this.customApiKey,
      goal: this.goal,
      task: task,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return res.data.response as string;
  }

  stopAgent() {
    this.isRunning = false;
  }

  sendGoalMessage() {
    this.sendMessage({ type: "goal", value: this.goal });
  }

  sendLoopMessage() {
    this.sendMessage({
      type: "system",
      value:
        this.customApiKey !== ""
          ? `This agent has been running for too long (25 Loops). To save your wallet, and our infrastructure costs, this agent is shutting down. In the future, the number of iterations will be configurable.`
          : "We're sorry, because this is a demo, we cannot have our agents running for too long. Note, if you desire longer runs, please provide your own API key in Settings. Shutting down.",
    });
  }

  sendManualShutdownMessage() {
    this.sendMessage({
      type: "system",
      value: `The agent has been manually shutdown.`,
    });
  }

  sendCompletedMessage() {
    this.sendMessage({
      type: "system",
      value: "All tasks completed. Shutting down.",
    });
  }

  sendThinkingMessage() {
    this.sendMessage({ type: "thinking", value: "" });
  }

  sendTaskMessage(task: string) {
    this.sendMessage({ type: "task", value: task });
  }

  sendErrorMessage(error: string) {
    this.sendMessage({ type: "system", value: error });
  }

  sendExecutionMessage(task: string, execution: string) {
    this.sendMessage({
      type: "action",
      info: `Executing "${task}"`,
      value: execution,
    });
  }

  sendActionMessage(message: string) {
    this.sendMessage({
      type: "action",
      info: message,
      value: "",
    });
  }
}

export default AutonomousAgent;
