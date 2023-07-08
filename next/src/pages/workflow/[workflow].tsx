import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import FlowChart from "../../components/workflow/Flowchart";
import { useWorkflow } from "../../hooks/useWorkflow";

import { useRouter } from "next/router";
import DashboardLayout from "../../layout/dashboard";
import Button from "../../ui/button";
import { languages } from "../../utils/languages";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../../next-i18next.config";

const WorkflowPage: NextPage = () => {
  const router = useRouter();

  const { nodesModel, edgesModel, saveWorkflow, executeWorkflow, createNode } = useWorkflow(
    router.query.workflow as string
  );

  return (
    <DashboardLayout>
      <FlowChart
        controls={true}
        isLoading={false}
        nodesModel={nodesModel}
        edgesModel={edgesModel}
        className="min-h-screen flex-1"
      />
      <div>
        <div className="absolute bottom-4 right-4 flex flex-row items-center justify-center gap-2">
          <Button
            className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-purple-700"
            onClick={() => {
              createNode();
            }}
          >
            New
          </Button>
          <Button
            className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-purple-700"
            onClick={async () => {
              await saveWorkflow();
            }}
          >
            Save
          </Button>
          <Button
            className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-purple-700"
            onClick={async () => {
              await executeWorkflow();
            }}
          >
            Execute
          </Button>
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
