import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { FaSave } from "react-icons/fa";

import nextI18NextConfig from "../../../next-i18next.config";
import { getWorkflowSidebar } from "../../components/drawer/WorkflowSidebar";
import PrimaryButton from "../../components/PrimaryButton";
import FlowChart from "../../components/workflow/Flowchart";
import { useAuth } from "../../hooks/useAuth";
import { useWorkflow } from "../../hooks/useWorkflow";
import DashboardLayout from "../../layout/dashboard";
import { languages } from "../../utils/languages";

const WorkflowPage: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true });
  const router = useRouter();

  const [file, setFile] = useState<File>();

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
      <input
        className="fixed z-20 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />

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
              saveWorkflow(file).catch(console.error);
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
