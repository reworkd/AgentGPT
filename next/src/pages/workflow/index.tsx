import { useQuery } from "@tanstack/react-query";
import type { GetStaticProps } from "next";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { FaBuilding, FaHome, FaRobot, FaSave } from "react-icons/fa";

import nextI18NextConfig from "../../../next-i18next.config";
import WorkflowSidebar from "../../components/drawer/WorkflowSidebar";
import Loader from "../../components/loader";
import PrimaryButton from "../../components/PrimaryButton";
import BlockDialog from "../../components/workflow/BlockDialog";
import FlowChart from "../../components/workflow/Flowchart";
import { useAuth } from "../../hooks/useAuth";
import { useWorkflow } from "../../hooks/useWorkflow";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";
import WorkflowApi from "../../services/workflow/workflowApi";
import { useLayoutStore } from "../../stores/layoutStore";
import Select from "../../ui/select";
import { languages } from "../../utils/languages";
import { get_avatar } from "../../utils/user";

const isTypeError = (error: unknown): error is TypeError =>
  error instanceof Error && error.name === "TypeError";

const isError = (error: unknown): error is Error =>
  error instanceof Error && error.name === "Error";

const WorkflowPage: NextPage = () => {
  const { session } = useAuth({
    protectedRoute: true,
    isAllowed: (session) => !!session?.user.organizations.length,
  });
  const router = useRouter();

  const handleClick = async () => {
    try {
      await saveWorkflow();
      window.alert("Workflow saved successfully!");
    } catch (error: unknown) {
      if (isTypeError(error) && error.message === "Failed to fetch")
        window.alert(
          "An error occurred while saving the workflow. Please refresh and re-attempt to save."
        );
      else if (isError(error) && error.message === "Unprocessable Entity")
        window.alert("Invalid workflow. Make sure to clear unconnected nodes and remove cycles.");
      else window.alert("An error occurred while saving the workflow.");
    }
  };

  const {
    nodesModel,
    edgesModel,
    selectedNode,
    saveWorkflow,
    createNode,
    updateNode,
    members,
    isLoading,
  } = useWorkflow(router.query.w as string, session);

  const { data: workflows } = useQuery(
    ["workflows"],
    async () => {
      const flows = await WorkflowApi.fromSession(session).getAll();
      if (!router.query.w && flows?.[0]) await changeQueryParams({ w: flows[0].id });
      return flows;
    },
    {
      enabled: !!session,
    }
  );

  const layout = useLayoutStore();
  useEffect(() => {
    layout.setLayout({ showRightSidebar: !!selectedNode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  const [open, setOpen] = useState(false);

  const changeQueryParams = async (newParams: Record<string, string>) => {
    const updatedParams = {
      ...router.query,
      ...newParams,
    };

    const newURL = {
      pathname: router.pathname,
      query: updatedParams,
    };

    await router.replace(newURL, undefined, { shallow: true });
  };

  return (
    <>
      <BlockDialog
        openModel={[open, setOpen]}
        items={getNodeBlockDefinitions()}
        onClick={(t) =>
          createNode({
            type: t.type,
            input: {},
          })
        }
      />

      <div className="fixed top-0 z-10 flex w-full flex-row items-center justify-between p-2">
        <div className="flex flex-row items-center gap-2">
          <a
            className="rounded-sm p-0.5 ring-2 ring-black"
            onClick={() => void router.push("/home")}
          >
            <Image src="/logos/light-default-solid.svg" width="24" height="24" alt="Reworkd AI" />
          </a>
          <a className="rounded-sm p-1 ring-2 ring-black" onClick={() => void router.push("/")}>
            <FaHome size="20" />
          </a>
          <Select<{ id: string; name: string }>
            value={session?.user.organizations?.[0]}
            items={session?.user.organizations}
            valueMapper={(org) => org?.name}
            icon={FaBuilding}
            defaultValue={{ id: "default", name: "Select an org" }}
            disabled
          />
          <Select<{ id: string; name: string }>
            value={workflows?.find((w) => w.id === router.query.w)}
            onChange={async (e) => {
              if (e) await changeQueryParams({ w: e.id });
            }}
            items={workflows}
            valueMapper={(item) => item?.name}
            icon={FaRobot}
            defaultValue={{ id: "default", name: "Select an workflow" }}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          {Object.entries(members).map(([id, user]) => (
            <img
              className="h-6 w-6 rounded-full bg-neutral-800 ring-2 ring-gray-200/20"
              key={id}
              src={get_avatar(user)}
              alt="user avatar"
            />
          ))}
          <PrimaryButton icon={<FaSave size="15" />} onClick={handleClick}>
            Save
          </PrimaryButton>
        </div>
      </div>

      <div className="fixed right-0 top-16 z-10 flex flex-col items-center justify-between ">
        <WorkflowSidebar
          createNode={createNode}
          updateNode={updateNode}
          selectedNode={selectedNode}
          nodes={nodesModel[0]}
          edges={edgesModel[0]}
        />
      </div>

      {isLoading && (
        <div className="fixed left-1/2 top-1/2 z-50">
          <Loader size={60} color="black" className="-translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      <FlowChart
        controls={true}
        nodesModel={nodesModel}
        edgesModel={edgesModel}
        className="min-h-screen flex-1"
        onPaneClick={() => setOpen(true)}
      />
    </>
  );
};

export default WorkflowPage;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
