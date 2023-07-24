import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FaSave } from "react-icons/fa";

import nextI18NextConfig from "../../../next-i18next.config";
import { getWorkflowSidebar } from "../../components/drawer/WorkflowSidebar";
import PrimaryButton from "../../components/PrimaryButton";
import FlowChart from "../../components/workflow/Flowchart";
import { useAuth } from "../../hooks/useAuth";
import { useWorkflow } from "../../hooks/useWorkflow";
import DashboardLayout from "../../layout/dashboard";
import { languages } from "../../utils/languages";
import { get_avatar } from "../../utils/user";

const WorkflowPage: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true });
  const { query } = useRouter();

  const { nodesModel, edgesModel, selectedNode, saveWorkflow, createNode, updateNode, members } =
    useWorkflow(query.workflow as string, session);

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
        <div className="absolute bottom-4 left-12 flex flex-row">
          {Object.entries(members).map(([id, user]) => (
            <img
              className="h-6 w-6 rounded-full bg-neutral-800 ring-2 ring-gray-200/20"
              key={id}
              src={get_avatar(user)}
              alt="user avatar"
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 flex flex-row items-center justify-center gap-2">
          <PrimaryButton
            icon={<FaSave size="15" />}
            onClick={() => {
              saveWorkflow().catch(console.error);
            }}
          >
            Save
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
