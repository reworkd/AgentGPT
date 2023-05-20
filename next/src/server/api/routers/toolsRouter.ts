import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { env } from "../../../env/server.mjs";

const Tool = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
});

const ToolResponse = z.object({
  tools: z.array(Tool),
});

export const toolsRouter = createTRPCRouter({
  getUserTools: publicProcedure.query(async ({ ctx }): Promise<z.infer<typeof ToolResponse>> => {
    const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/agent/tools`);
    return ToolResponse.parse(res.data);
  }),
});
