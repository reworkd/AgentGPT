import { z } from "zod";
import { get, post } from "../fetch-utils";

const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export default class WorkflowApi {
  readonly accessToken?: string;
  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  async getAll() {
    return await get("/api/workflow", z.array(WorkflowSchema), this.accessToken);
  }

  async get(id: string) {
    return await get(`/api/workflow/${id}`, WorkflowSchema, this.accessToken);
  }

  async create() {
    return await post(
      "/api/workflow",
      WorkflowSchema,
      {
        name: "New Workflow",
        description: "A new workflow",
      },
      this.accessToken
    );
  }
}
