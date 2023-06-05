import type { RequestBody } from "../../utils/interfaces";
import type { Analysis } from "./analysis";
import type { Session } from "next-auth";
import { useAgentStore } from "../../stores";
import * as apiUtils from "../api-utils";

type ApiProps = Pick<RequestBody, "modelSettings" | "goal"> & {
  session?: Session;
};

export class AgentApi {
  readonly props: ApiProps;
  readonly onError: (e: unknown) => never;
  runId: string | undefined;

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
  private async post<T>(url: string, data: Omit<RequestBody, "goal" | "modelSettings" | "run_id">) {
    const requestBody: RequestBody = {
      modelSettings: this.props.modelSettings,
      goal: this.props.goal,
      run_id: this.runId,
      ...data,
    };

    try {
      const { run_id, ...data } = await apiUtils.post<T & { run_id: string }>(
        url,
        requestBody,
        this.props.session
      );

      if (this.runId === undefined) this.runId = run_id;
      return data;
    } catch (e) {
      this.onError(e);
    }
  }
}
