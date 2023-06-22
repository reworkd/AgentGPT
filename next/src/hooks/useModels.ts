import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchAPI } from "../services/api-utils";

const Model = z.object({
  name: z.string(),
  max_tokens: z.number(),
  has_access: z.boolean(),
});

const ModelList = z.array(Model);

export type LLMModel = z.infer<typeof Model>;

export function useModels() {
  const { data: session } = useSession();
  const query = useQuery(
    ["llm"],
    async () => await fetchAPI("/api/models", ModelList, session?.accessToken),
    {
      enabled: !!session?.accessToken,
    }
  );

  return {
    models: query.data ?? [],
    getModel: (name: string) => query.data?.find((m) => m.name === name),
  };
}
