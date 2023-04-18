import { api } from "../utils/api";
import type { Message } from "../types/agentTypes";

export interface SaveProps {
  name: string;
  goal: string;
  tasks: Message[];
}

export function useAgent() {
  const utils = api.useContext();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const voidFunc = () => {};
  const saveMutation = api.agent.create.useMutation({
    onSuccess: (data) => {
      utils.agent.getAll.setData(voidFunc(), (oldData) => [
        ...(oldData ?? []),
        data,
      ]);
    },
  });

  const saveAgent = (type: string, data: SaveProps) => {
    saveMutation.mutate(data);
  };

  return {
    saveAgent,
  };
}
