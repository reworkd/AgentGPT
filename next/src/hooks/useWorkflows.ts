import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { WorkflowMeta } from "../services/workflow/workflowApi";
import WorkflowApi from "../services/workflow/workflowApi";

export default function useWorkflows(accessToken?: string, organizationId?: string) {
  const api = new WorkflowApi(accessToken, organizationId);

  const queryClient = useQueryClient();
  const { data: workflows, refetch } = useQuery(["workflows"], async () => await api.getAll(), {
    enabled: !!accessToken && !!organizationId,
  });

  // Optimistic update when creating a workflow, we don't need to fetch again
  const { mutateAsync } = useMutation(
    async (data: Omit<WorkflowMeta, "id" | "user_id" | "organization_id">) => {
      const workflow = await api.create(data);
      queryClient.setQueriesData(["workflows"], (oldData: WorkflowMeta[] | undefined) => [
        ...(oldData || []),
        workflow,
      ]);
      return workflow;
    }
  );

  return {
    workflows,
    refetchWorkflows: refetch,
    createWorkflow: mutateAsync,
  };
}
