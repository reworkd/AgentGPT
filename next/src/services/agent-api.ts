import type { RequestBody } from "../utils/interfaces";
import type { Analysis } from "./agent-service";
import { env } from "../env/client.mjs";
import { useAgentStore } from "../stores";
import * as apiUtils from "./api-utils";
import { Session } from "next-auth";

type ApiProps = Pick<RequestBody, "modelSettings" | "language" | "goal"> & {
  session?: Session;
};
export class AgentApi {
  readonly props: ApiProps;
  readonly onError: (e: unknown) => never;
  _runId: string | null = null;

  constructor(apiProps: ApiProps, onError: (e: unknown) => never) {
    this.props = apiProps;
    this.onError = onError;
  }

  async getInitialTasks(): Promise<string[]> {
    const response = await this.post<{ runId: string; newTasks: string[] }>("/api/agent/start", {});
    this._runId = response.runId;
    return response.newTasks;
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

  private async post<T>(
    url: string,
    data: Omit<RequestBody, "language" | "goal" | "modelSettings">
  ) {
    const requestBody: RequestBody = {
      modelSettings: this.props.modelSettings,
      language: this.props.language,
      goal: this.props.goal,
      ...(this._runId && { runId: this._runId }),
      ...data,
    };

    try {
      return apiUtils.post<T>(env.NEXT_PUBLIC_BACKEND_URL + url, requestBody, this.props.session);
    } catch (e) {
      this.onError(e);
    }
  }
}
