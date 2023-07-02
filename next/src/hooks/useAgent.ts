import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import type { CreateAgentProps, SaveAgentProps } from "../server/api/routers/agentRouter";

export function useAgent() {
  const { status } = useAuth();
  const utils = api.useContext();
  const voidFunc = () => void 0;

  const createMutation = api.agent.create.useMutation({
    onSuccess: (data) => {
      utils.agent.getAll.setData(voidFunc(), (oldData) => [data, ...(oldData ?? [])]);
    },
  });

  const saveMutation = api.agent.save.useMutation({
    onSuccess: (data) => {
      utils.agent.getAll.setData(voidFunc(), (oldData) => [data, ...(oldData ?? [])]);
    },
  });

  const createAgent = (data: CreateAgentProps) => {
    if (status === "authenticated") createMutation.mutate(data);
  };

  const saveAgent = (data: SaveAgentProps) => {
    if (status === "authenticated") saveMutation.mutate(data);
  };

  return {
    createAgent,
    saveAgent,
  };
}
