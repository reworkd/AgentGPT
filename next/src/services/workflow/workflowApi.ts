import { z } from "zod";
import { get, post, put } from "../fetch-utils";
import type { Workflow } from "../../types/workflow";
import { WorkflowSchema } from "../../types/workflow";

const WorkflowMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

type WorkflowMeta = z.infer<typeof WorkflowMetaSchema>;

export default class WorkflowApi {
  readonly accessToken?: string;
  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  async getAll() {
    return await get("/api/workflow", z.array(WorkflowMetaSchema), this.accessToken);
  }

  async get(id: string) {
    return await get(`/api/workflow/${id}`, WorkflowSchema, this.accessToken);
  }

  async update(id: string, data: Workflow) {
    return await put(`/api/workflow/${id}`, z.string(), data, this.accessToken);
  }

  async create(workflow: Omit<WorkflowMeta, "id">) {
    return await post("/api/workflow", WorkflowMetaSchema, workflow, this.accessToken);
  }

  async execute(id: string) {
    return await post(`/api/workflow/${id}/execute`, z.string(), {}, this.accessToken);
  }
}
