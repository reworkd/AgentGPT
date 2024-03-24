import type { Session } from "next-auth";

import type { Analysis } from "./analysis";
import type { AgentUtils } from "../../hooks/useAgent";
import { useAgentStore } from "../../stores";
import type { Message } from "../../types/message";
import type { RequestBody } from "../../utils/interfaces";
import * as apiUtils from "../api-utils";

type ApiProps = Pick<RequestBody, "model_settings" | "goal"> & {
  session?: Session;
  agentUtils: AgentUtils;
};

export class AgentApi {
  readonly props: ApiProps;
  agentId: string | undefined;
  runId: string | undefined;

  constructor(apiProps: ApiProps) {
    this.props = apiProps;
  }

  async createAgent(): Promise<void> {
    if (this.agentId) return;
    const agent = await this.props.agentUtils.createAgent({
      goal: this.props.goal,
    });
    this.agentId = agent?.id;
  }

  saveMessages(messages: Message[]): void {
    if (!this.agentId) return;

    this.props.agentUtils.saveAgent({
      id: this.agentId,
      tasks: messages,
    });
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
        last_task: tasks.current,
        tasks: tasks.remaining,
        completed_tasks: tasks.completed,
      })
    ).newTasks;
  }

  async analyzeTask(task: string): Promise<Analysis> {
    return await this.post<Analysis>("/api/agent/analyze", {
      task: task,
      tool_names: useAgentStore.getState().tools.map((tool) => tool.name),
    });
  }

  private async post<T>(
    url: string,
    data: Omit<RequestBody, "goal" | "model_settings" | "run_id">
  ) {
    const requestBody: RequestBody = {
      model_settings: this.props.model_settings,
      goal: this.props.goal,
      run_id: this.runId,
      ...data,
    };

    try {
      useAgentStore.getState().setIsAgentThinking(true);
      const { run_id, ...data } = await apiUtils.post<T & { run_id: string }>(
        url,
        requestBody,
        this.props.session
      );

      if (this.runId === undefined) this.runId = run_id;
      return data;
    } finally {
      useAgentStore.getState().setIsAgentThinking(false);
    }
  }
}
