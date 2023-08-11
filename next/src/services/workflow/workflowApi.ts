import axios from "axios";
import { z } from "zod";

import type { Workflow } from "../../types/workflow";
import { WorkflowSchema } from "../../types/workflow";
import { delete_, get, post, put } from "../fetch-utils";

const WorkflowMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  user_id: z.string(),
  organization_id: z.string().nullable(),
});

const PresignedPostSchema = z.object({
  url: z.string(),
  fields: z.record(z.string()),
});

export type WorkflowMeta = z.infer<typeof WorkflowMetaSchema>;
export type PresignedPost = z.infer<typeof PresignedPostSchema>;

export default class WorkflowApi {
  readonly accessToken?: string;
  readonly organizationId?: string;

  constructor(accessToken?: string, organizationId?: string) {
    this.accessToken = accessToken;
    this.organizationId = organizationId;
  }

  async getAll() {
    return await get(
      "/api/workflow",
      z.array(WorkflowMetaSchema),
      this.accessToken,
      this.organizationId
    );
  }

  async get(id: string) {
    return await get(`/api/workflow/${id}`, WorkflowSchema, this.accessToken, this.organizationId);
  }

  async update(id: string, data: Workflow) {
    await put(`/api/workflow/${id}`, z.any(), data, this.accessToken, this.organizationId);
  }

  async delete(id: string) {
    await delete_(`/api/workflow/${id}`, z.any(), {}, this.accessToken, this.organizationId);
  }

  async create(workflow: Omit<WorkflowMeta, "id" | "user_id" | "organization_id">) {
    return await post(
      "/api/workflow",
      WorkflowMetaSchema,
      workflow,
      this.accessToken,
      this.organizationId
    );
  }

  async execute(id: string) {
    return await post(
      `/api/workflow/${id}/execute`,
      z.string(),
      {},
      this.accessToken,
      this.organizationId
    );
  }

  async upload(workflow_id: string, block_ref: string, files: File[]) {
    const posts = await put(
      `/api/workflow/${workflow_id}/block/${block_ref}/upload`,
      z.record(PresignedPostSchema),
      { files: files.map((file) => file.name) },
      this.accessToken,
      this.organizationId
    );

    await Promise.all(
      // @ts-ignore
      Object.entries(posts).map(([filename, post], i) => this.uploadFile(post, files[i]))
    );
  }

  async uploadFile(req: PresignedPost, file: File) {
    const { url, fields } = req;

    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const uploadResponse = await axios.post(url, formData, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return uploadResponse.status;
  }

  async blockInfo(workflow_id: string, block_ref: string) {
    return await get(
      `/api/workflow/${workflow_id}/block/${block_ref}`,
      z.object({
        files: z.array(z.string()),
      }),
      this.accessToken,
      this.organizationId
    );
  }

  async blockInfoDelete(workflow_id: string, block_ref: string) {
    await delete_(
      `/api/workflow/${workflow_id}/block/${block_ref}`,
      z.any(),
      this.accessToken,
      this.organizationId
    );
  }
}
