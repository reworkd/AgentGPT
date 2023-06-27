import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import type { Message } from "../types/message";

export interface SaveProps {
  name: string;
  goal: string;
  tasks: Message[];
}

export function useAgent() {
  const { status } = useAuth();
  const utils = api.useContext();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const voidFunc = () => {};
  const saveMutation = api.agent.create.useMutation({
    onSuccess: (data) => {
      utils.agent.getAll.setData(voidFunc(), (oldData) => [data, ...(oldData ?? [])]);
    },
  });

  const saveAgent = (data: SaveProps) => {
    if (status === "authenticated") saveMutation.mutate(data);
  };

  return {
    saveAgent,
  };
}
