import type { GetStaticProps, NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { WorkflowMeta } from "../../services/workflow/workflowApi";
import WorkflowApi from "../../services/workflow/workflowApi";
import { languages } from "../../utils/languages";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../../next-i18next.config";
import DashboardLayout from "../../layout/dashboard";
import EmptyWorkflowButton from "../../components/workflow/EmptyWorkflow";
import { useAuth } from "../../hooks/useAuth";
import WorkflowCard, { WorkflowCardDialog } from "../../components/workflow/WorkflowCard";
import { LayoutGroup } from "framer-motion";
import { useState } from "react";

const WorkflowList: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true });
  const router = useRouter();

  const api = new WorkflowApi(session?.accessToken);
  const query = useQuery(["workflows"], async () => await api.getAll(), {
    enabled: !!session,
  });

  const data = query.data ?? [];
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowMeta | null>(null);

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
              api
                .create({
                  name: "New Workflow",
                  description: "New Workflow",
                })
                .then((workflow) => {
                  void router.push(`workflow/${workflow.id}`);
                })
                .catch(console.error);
            }}
          />
        </div>
        {selectedWorkflow != null && (
          <WorkflowCardDialog
            workflow={selectedWorkflow}
            onClick={() => {
              void router.push(`workflow/${selectedWorkflow.id}`);
            }}
            handleClose={() => setSelectedWorkflow(null)}
          />
        )}
      </LayoutGroup>
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
