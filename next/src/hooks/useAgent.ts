import type { Agent as PrismaAgent } from "@prisma/client";

import { useAuth } from "./useAuth";
import type { CreateAgentProps, SaveAgentProps } from "../server/api/routers/agentRouter";
import { api } from "../utils/api";


export type AgentUtils = {
  createAgent: (data: CreateAgentProps) => Promise<PrismaAgent | undefined>;
  saveAgent: (data: SaveAgentProps) => void;
  deleteAgent: (id: string) => void;
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
      return await createMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  };

  const saveMutation = api.agent.save.useMutation();
  const saveAgent = (data: SaveAgentProps) => {
    if (status === "authenticated") saveMutation.mutate(data);
  };

  const deleteMutation = api.agent.deleteById.useMutation({
    onSuccess: (id: string) => {
      utils.agent.getAll.setData(void 0, (oldData) => oldData?.filter(agent => agent.id !== id));
    },
  });
  const deleteAgent = (id: string) => {
    if (status === "authenticated") deleteMutation.mutate(id);
  };

  return {
    createAgent,
    saveAgent,
    deleteAgent,
  };
}
