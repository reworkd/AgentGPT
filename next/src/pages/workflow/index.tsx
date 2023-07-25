import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "framer-motion";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

import nextI18NextConfig from "../../../next-i18next.config";
import CreateWorkflowDialog from "../../components/workflow/CreateWorkflowDialog";
import EmptyWorkflowButton from "../../components/workflow/EmptyWorkflow";
import WorkflowCard from "../../components/workflow/WorkflowCard";
import WorkflowDialog from "../../components/workflow/WorkflowDialog";
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);

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

  const saveWorkflow = (workflow: WorkflowMeta) => {
    // TODO
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
                setShowWorkflowDialog(true);
              }}
            />
          ))}
          <EmptyWorkflowButton
            onClick={() => {
              setShowCreateDialog(true);
            }}
          />
        </div>
      </LayoutGroup>
      <WorkflowDialog
        workflow={selectedWorkflow}
        openWorkflow={() => {
          void router.push(`workflow/${selectedWorkflow?.id || ""}`);
        }}
        saveWorkflow={saveWorkflow}
        showDialog={showWorkflowDialog}
        setShowDialog={setShowWorkflowDialog}
      />
      <CreateWorkflowDialog
        showDialog={showCreateDialog}
        setShowDialog={setShowCreateDialog}
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
