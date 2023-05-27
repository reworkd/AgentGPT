import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { env } from "../../../env/server.mjs";

const ToolModelSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
});
export type ToolModel = z.infer<typeof ToolModelSchema>;
export type Tool = ToolModel & { active: boolean };

/*
 * Returns the tool models available to the user from the backend.
 * Also adds an active boolean for whether the agent can use the tool.
 */
export const toolsRouter = createTRPCRouter({
  getUserTools: publicProcedure.query(async ({ ctx }): Promise<Tool[]> => {
    const res = await axios.get<{ tools: ToolModel[] }>(
      `${env.PLATFORM_URL || ""}/api/agent/tools`
    );
    const toolModels = res.data.tools.map((toolModel) => ToolModelSchema.parse(toolModel));

    return toolModels.map((toolModel) => {
      return { ...toolModel, active: true };
    });
  }),
});
