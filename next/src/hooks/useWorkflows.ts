import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { WorkflowMeta } from "../services/workflow/workflowApi";
import WorkflowApi from "../services/workflow/workflowApi";

export default function useWorkflows(accessToken?: string, organizationId?: string) {
  const api = new WorkflowApi(accessToken, organizationId);

  const queryClient = useQueryClient();
  const { data: workflows, refetch: refetchWorkflows } = useQuery(
    ["workflows"],
    async () => await api.getAll(),
    {
      enabled: !!accessToken && !!organizationId,
    }
  );

  // Optimistic update when creating a workflow, we don't need to fetch again
  const { mutateAsync: createWorkflow } = useMutation(
    async (data: Omit<WorkflowMeta, "id" | "user_id" | "organization_id">) => {
      const workflow = await api.create(data);
      queryClient.setQueriesData(["workflows"], (oldData: WorkflowMeta[] | undefined) => [
        ...(oldData || []),
        workflow,
      ]);
      return workflow;
    }
  );

  const { mutateAsync: deleteWorkflow } = useMutation(async (id: string) => {
    await api.delete(id);
    queryClient.setQueriesData(["workflows"], (oldData: WorkflowMeta[] | undefined) =>
      (oldData || []).filter((workflow) => workflow.id !== id)
    );
  });

  return {
    workflows,
    refetchWorkflows,
    createWorkflow,
    deleteWorkflow,
  };
}
