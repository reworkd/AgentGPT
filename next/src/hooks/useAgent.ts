import type { Agent as PrismaAgent } from "@prisma/client";

import { useAuth } from "./useAuth";
import type { CreateAgentProps, SaveAgentProps } from "../server/api/routers/agentRouter";
import { api } from "../utils/api";


export type AgentUtils = {
  createAgent: (data: CreateAgentProps) => Promise<PrismaAgent | undefined>;
  saveAgent: (data: SaveAgentProps) => void;
};

export function useAgent(): AgentUtils {
  const { status } = useAuth();
  const utils = api.useContext();

  const createMutation = api.agent.create.useMutation({
    onSuccess: (data: PrismaAgent) => {
      utils.agent.getAll.setData(void 0, (oldData) => [data, ...(oldData ?? [])]);
      return data;
    },
  });
  const createAgent = async (data: CreateAgentProps): Promise<PrismaAgent | undefined> => {
    if (status === "authenticated") {
      try {
        return await createMutation.mutateAsync(data);
      } catch (error) {
        console.error("Failed to create agent:", error);
        // Optionally, you could return an error object or notify the user
      }
    }
    return undefined;
  };
  
  const saveAgent = (data: SaveAgentProps) => {
    if (status === "authenticated") {
      saveMutation.mutate(data, {
        onError: (error) => {
          console.error("Failed to save agent:", error);
        },
      });
    }
  };
  