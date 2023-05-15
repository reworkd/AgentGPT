import { api } from "../utils/api";
import type { Message } from "../types/agentTypes";
import { useAuth } from "./useAuth";

export interface SaveProps {
  name: string;
  goal: string;
  tasks: Message[];
}

export function useAgent() {
  const { status } = useAuth();
  const utils = api.useContext();

  const saveMutation = api.agent.create.useMutation({
    onSuccess: (data) => {
      utils.agent.getAll.setData(undefined, (oldData) => [data, ...(oldData ?? [])]);
    },
  });

  const saveAgent = (data: SaveProps) => {
    if (status === "authenticated") saveMutation.mutate(data);
  };

  return {
    saveAgent,
  };
}
