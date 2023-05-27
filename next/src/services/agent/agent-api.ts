import type { RequestBody } from "../../utils/interfaces";
import axios from "axios";
import { env } from "../../env/client.mjs";
import { useAgentStore } from "../../stores";
import type { Analysis } from "./analysis";

type ApiProps = Pick<RequestBody, "modelSettings" | "goal">;

export class AgentApi {
  readonly props: ApiProps;
  readonly onError: (e: unknown) => never;

  constructor(apiProps: ApiProps, onError: (e: unknown) => never) {
    this.props = apiProps;
    this.onError = onError;
  }

  async getInitialTasks(): Promise<string[]> {
    return (await this.post<{ newTasks: string[] }>("/api/agent/start", {})).newTasks;
  }

  async getAdditionalTasks(
    tasks: {
      current: string;
      completed: string[];
      remaining: string[];
    },
    result: string
  ): Promise<string[]> {
    return (
      await this.post<{ newTasks: string[] }>("/api/agent/create", {
        result: result,
        lastTask: tasks.current,
        tasks: tasks.remaining,
        completedTasks: tasks.completed,
      })
    ).newTasks;
  }

  async analyzeTask(task: string): Promise<Analysis> {
    return await this.post<Analysis>("/api/agent/analyze", {
      task: task,
      toolNames: useAgentStore.getState().tools.map((tool) => tool.name),
    });
  }

  async executeTask(task: string, analysis: Analysis): Promise<string> {
    return (
      await this.post<{ response: string }>("/api/agent/execute", {
        task: task,
        analysis: analysis,
      })
    ).response;
  }

  private async post<T>(url: string, data: Omit<RequestBody, "goal" | "modelSettings">) {
    const requestBody: RequestBody = {
      modelSettings: this.props.modelSettings,
      goal: this.props.goal,
      ...data,
    };

    try {
      return (await axios.post(env.NEXT_PUBLIC_BACKEND_URL + url, requestBody)).data as T;
    } catch (e) {
      this.onError(e);
    }
  }
}
