import { z } from "zod";
import { useSession } from "next-auth/react";
import { env } from "../env/client.mjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAgentStore } from "../stores";

const Tool = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
});

const ToolsResponseSchema = z.object({
  tools: z.array(Tool),
});

const ActiveToolSchema = Tool.extend({
  active: z.boolean(),
});

export type ActiveTool = z.infer<typeof ActiveToolSchema>;

const fetchAPI = async <T extends z.ZodTypeAny>(path: string, schema: T): Promise<z.infer<T>> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`);
  if (!response.ok) {
    throw new Error("Request failed");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(await response.json());
};

const loadTools = async (key: string) => {
  const allTools = await fetchAPI("/api/agent/tools", ToolsResponseSchema);

  const data = localStorage.getItem(key);
  let activeTools: ActiveTool[] = [];

  try {
    const obj = z.array(ActiveToolSchema).parse(JSON.parse(data ?? ""));
    activeTools = allTools.tools.map((db_tool) => {
      const tool = obj.find((t) => t.name === db_tool.name);
      return tool ?? { ...db_tool, active: true };
    });
  } catch (error) {
    activeTools = allTools.tools.map((toolModel) => ({ ...toolModel, active: true }));
  }

  return activeTools;
};

const save = (key: string, data: object) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export function useTools() {
  const { data: Session } = useSession();
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
