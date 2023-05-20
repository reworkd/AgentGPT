import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { env } from "../../../env/server.mjs";

const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
});
export type Tool = z.infer<typeof ToolSchema>;

const ToolResponseSchema = z.object({
  tools: z.array(ToolSchema),
});
export type ToolResponse = z.infer<typeof ToolResponseSchema>;

export const toolsRouter = createTRPCRouter({
  getUserTools: publicProcedure.query(async ({ ctx }): Promise<ToolResponse> => {
    const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/api/agent/tools`);
    return ToolResponseSchema.parse(res.data);
  }),
});
