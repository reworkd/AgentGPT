import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "framer-motion";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

import nextI18NextConfig from "../../../next-i18next.config";
import CreateWorkflowDialog from "../../components/workflow/CreateWorkflowDialog";
import EmptyWorkflowButton from "../../components/workflow/EmptyWorkflow";
import WorkflowCard, { WorkflowCardDialog } from "../../components/workflow/WorkflowCard";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layout/dashboard";
import type { WorkflowMeta } from "../../services/workflow/workflowApi";
import WorkflowApi from "../../services/workflow/workflowApi";
import { languages } from "../../utils/languages";

const WorkflowList: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true, isAllowed: (s) => s.user.superAdmin });

  const router = useRouter();
  const org = session?.user?.organizations?.at(0)?.id;
  const api = new WorkflowApi(session?.accessToken, org);
  const query = useQuery(["workflows"], async () => await api.getAll(), {
    enabled: !!session,
  });

  const data = query.data ?? [];
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowMeta | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateWorkflow = (name: string, description: string) => {
    api
      .create({
        name: name,
        description: description,
      })
      .then((workflow) => {
        void router.push(`workflow/${workflow.id}`);
      })
      .catch(console.error);
  };

  return (
    <DashboardLayout>
      <LayoutGroup>
        <div className="grid grid-cols-2 gap-5 p-8 sm:grid-cols-3 lg:sm:grid-cols-4">
          {data.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onClick={() => {
                setSelectedWorkflow(workflow);
              }}
            />
          ))}
          <EmptyWorkflowButton
            onClick={() => {
              setShowDialog(true);
            }}
          />
        </div>
        {selectedWorkflow != null && (
          <WorkflowCardDialog
            workflow={selectedWorkflow}
            onEdit={() => {
              void router.push(`workflow/${selectedWorkflow.id}`);
            }}
            onDelete={() => {
              api
                .delete(selectedWorkflow.id)
                .then(async () => {
                  await query.refetch();
                  setSelectedWorkflow(null);
                })
                .catch(console.error);
            }}
            onClose={() => void setSelectedWorkflow(null)}
          />
        )}
      </LayoutGroup>
      <CreateWorkflowDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        createWorkflow={handleCreateWorkflow}
      />
    </DashboardLayout>
  );
};

export default WorkflowList;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
