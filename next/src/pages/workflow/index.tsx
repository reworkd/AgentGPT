import type { GetStaticProps, NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import WorkflowApi from "../../services/workflow/workflowApi";
import { languages } from "../../utils/languages";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../../next-i18next.config";
import DashboardLayout from "../../layout/dashboard";
import EmptyWorkflowButton from "../../components/workflow/EmptyWorkflow";
import { useAuth } from "../../hooks/useAuth";

const WorkflowList: NextPage = () => {
  const { session } = useAuth({ protectedRoute: true });
  const router = useRouter();

  const api = new WorkflowApi(session?.accessToken);
  const query = useQuery(["workflows"], async () => await api.getAll(), {
    enabled: !!session,
  });

  const data = query.data ?? [];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-4 gap-2 p-16">
        {data.map((workflow) => (
          <div
            key={workflow.id}
            className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-6"
            onClick={() => {
              void router.push(`workflow/${workflow.id}`);
            }}
          >
            <h1>{workflow.name}</h1>
            <h1>#{workflow.id}</h1>
            <p className="text-neutral-400">{workflow.description}</p>
          </div>
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
