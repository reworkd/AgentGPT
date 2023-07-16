import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import FlowChart from "../../components/workflow/Flowchart";
import { useWorkflow } from "../../hooks/useWorkflow";

import { useRouter } from "next/router";
import DashboardLayout from "../../layout/dashboard";
import { languages } from "../../utils/languages";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../../next-i18next.config";
import { getWorkflowSidebar } from "../../components/drawer/WorkflowSidebar";
import { useAuth } from "../../hooks/useAuth";
import PrimaryButton from "../../components/PrimaryButton";
import { FaPlay, FaSave } from "react-icons/fa";

const WorkflowPage: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true });
  const router = useRouter();

  const {
    nodesModel,
    edgesModel,
    selectedNode,
    saveWorkflow,
    executeWorkflow,
    createNode,
    updateNode,
  } = useWorkflow(router.query.workflow as string, session);

  return (
    <DashboardLayout
      rightSidebar={getWorkflowSidebar({
        createNode,
        selectedNode,
        updateNode,
        nodes: nodesModel[0],
        edges: edgesModel[0],
      })}
    >
      <FlowChart
        controls={true}
        nodesModel={nodesModel}
        edgesModel={edgesModel}
        className="min-h-screen flex-1"
      />
      <div className="relative h-full w-full">
        <div className="absolute bottom-4 right-4 flex flex-row items-center justify-center gap-2">
          <PrimaryButton
            icon={<FaSave size="15" />}
            onClick={() => {
              saveWorkflow().catch(console.error);
            }}
          >
            Save
          </PrimaryButton>
          <PrimaryButton
            icon={<FaPlay size="15" />}
            onClick={() => {
              executeWorkflow().catch(console.error);
            }}
          >
            Execute
          </PrimaryButton>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowPage;

export const getServerSideProps: GetServerSideProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
