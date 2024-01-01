import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { get } from "../services/fetch-utils";
import { useAgentStore } from "../stores";

const Tool = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  image_url: z.string().optional(),
});

const ToolsResponseSchema = z.object({
  tools: z.array(Tool),
});

const ActiveToolSchema = Tool.extend({
  active: z.boolean(),
});

export type ActiveTool = z.infer<typeof ActiveToolSchema>;

const loadTools = async (key: string) => {
  const allTools = await get("/api/agent/tools", ToolsResponseSchema);

  const data = localStorage.getItem(key);
  let activeTools: ActiveTool[] = [];

  try {
    const obj = z.array(ActiveToolSchema).parse(JSON.parse(data ?? ""));
    activeTools = allTools.tools.map((db_tool) => {
      const tool = obj.find((t) => t.name === db_tool.name);
      return tool ?? { ...db_tool, active: false };
    });
  } catch (error) {
    activeTools = allTools.tools.map((toolModel) => ({ ...toolModel, active: false }));
  }

  return activeTools;
};

const save = (key: string, data: object) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export function useTools() {
  const setTools = useAgentStore.use.setTools();

  const queryClient = useQueryClient();
  const query = useQuery(["tools"], () => loadTools("tools"), {
    onSuccess: (data) => {
      updateActiveTools(data);
    },
  });

  function updateActiveTools(data: ActiveTool[]) {
    save("tools", data);
    setTools(data.filter((tool) => tool.active));
  }

  const setToolActive = (toolName: string, active: boolean) => {
    queryClient.setQueriesData(["tools"], (old) => {
      const data = (old as ActiveTool[]).map((tool) =>
        tool.name === toolName ? { ...tool, active } : tool
      );

      updateActiveTools(data);
      return data;
    });
  };

  return {
    activeTools: query.data ?? [],
    setToolActive,
    isSuccess: query.isSuccess,
  };
}
