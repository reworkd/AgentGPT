import { z } from "zod";

import type { Workflow } from "../../types/workflow";
import { WorkflowSchema } from "../../types/workflow";
import { delete_ } from "../api-utils";
import { get, post, put } from "../fetch-utils";
import axios from "axios";

const WorkflowMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const PresignedPostSchema = z.object({
  url: z.string(),
  fields: z.record(z.string()),
});

export type WorkflowMeta = z.infer<typeof WorkflowMetaSchema>;
export type PresignedPost = z.infer<typeof PresignedPostSchema>;

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

  async update(id: string, { file, ...data }: Workflow & { file?: File }) {
    const post = await put(`/api/workflow/${id}`, PresignedPostSchema, data, this.accessToken);

    if (file) {
      return await this.uploadFile(post, file);
    }

    return 200;
  }

  async delete(id: string) {
    await delete_(`/api/workflow/${id}`, this.accessToken);
  }

  async create(workflow: Omit<WorkflowMeta, "id">) {
    return await post("/api/workflow", WorkflowMetaSchema, workflow, this.accessToken);
  }

  async execute(id: string) {
    return await post(`/api/workflow/${id}/execute`, z.string(), {}, this.accessToken);
  }

  async uploadFile(req: PresignedPost, file: File) {
    const { url, fields } = req;

    // Create a new form data instance to hold the file and the S3 fields
    const formData = new FormData();
    formData.append("file", file);

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const uploadResponse = await axios.put(url, formData, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return uploadResponse.status;
  }
}
