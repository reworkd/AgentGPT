import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import type { GetStaticProps } from "next";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { RiBuildingLine, RiStackFill } from "react-icons/ri";
import { RxHome, RxPlus, RxTrash } from "react-icons/rx";
import type { Connection, OnConnectStartParams } from "reactflow";
import { addEdge } from "reactflow";

import nextI18NextConfig from "../../../next-i18next.config";
import WorkflowSidebar from "../../components/drawer/WorkflowSidebar";
import Loader from "../../components/loader";
import FadeIn from "../../components/motions/FadeIn";
import BlockDialog from "../../components/workflow/BlockDialog";
import FlowChart from "../../components/workflow/Flowchart";
import { useAuth } from "../../hooks/useAuth";
import type { Position } from "../../hooks/useWorkflow";
import { useWorkflow } from "../../hooks/useWorkflow";
import useWorkflows from "../../hooks/useWorkflows";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";
import { useConfigStore } from "../../stores/configStore";
import Select from "../../ui/select";
import { languages } from "../../utils/languages";
import { get_avatar } from "../../utils/user";
import LogSidebar from "../../components/drawer/LogSidebar";

const isTypeError = (error: unknown): error is TypeError =>
  error instanceof Error && error.name === "TypeError";

const isError = (error: unknown): error is Error =>
  error instanceof Error && error.name === "Error";

const WorkflowPage: NextPage = () => {
  const { organization, setOrganization, layout, setLayout } = useConfigStore();
  const { session } = useAuth({
    protectedRoute: true,
  });
  const router = useRouter();
  const [newNodePosition, setNewNodePosition] = useState<Position>({ x: 0, y: 0 });
  const [onConnectStartParams, setOnConnectStartParams] = useState<
    OnConnectStartParams | undefined
  >(undefined);
  const handleSaveWorkflow = async () => {
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

  async function reset() {
    await changeQueryParams({ w: undefined });
    nodesModel.set([]);
    edgesModel.set([]);
  }

  const handlePlusClick = async () => {
    try {
      await reset();
      await saveWorkflow();
    } catch (error: unknown) {
      window.alert("An error occurred while creating a new workflow.");
    }
  };

  const workflowId = router.query.w as string | undefined;
  const {
    nodesModel,
    edgesModel,
    selectedNode,
    saveWorkflow,
    createNode,
    updateNode,
    members,
    isLoading,
  } = useWorkflow(workflowId, session, organization?.id);

  const [open, setOpen] = useState(false);

  const handlePaneDoubleClick = (position: { x: number; y: number }) => {
    if (!showCreateForm) {
      setNewNodePosition(position);
      setOpen(true);
    }
  };

  const changeQueryParams = async (newParams: Record<string, string | undefined>) => {
    let updatedParams = {
      ...router.query,
      ...newParams,
    };

    updatedParams = Object.entries(updatedParams).reduce((acc, [key, value]) => {
      if (!!value) acc[key] = value;
      return acc;
    }, {});

    const newURL = {
      pathname: router.pathname,
      query: updatedParams,
    };

    await router.replace(newURL, undefined, { shallow: true });
  };

  const showLoader = !router.isReady || (isLoading && !!workflowId);
  const showCreateForm = !workflowId && router.isReady;

  const { workflows, createWorkflow, deleteWorkflow, refetchWorkflows } = useWorkflows(
    session?.accessToken,
    organization?.id
  );

  const onCreate = async (name: string) => {
    const data = await createWorkflow({ name, description: "" });
    await changeQueryParams({ w: data.id });
  };

  const changeOrg = async (org: { id: string; name: string; role: string } | undefined) => {
    if (org === organization) return;
    setOrganization(org);
    await reset();
    await refetchWorkflows();
  };

  const handleDeleteClick = async () => {
    try {
      if (!workflowId) return;
      await reset();
      await deleteWorkflow(workflowId);
    } catch (error: unknown) {
      window.alert("An error occurred while deleting the workflow.");
    }
  };

  return (
    <>
      <BlockDialog
        openModel={[open, setOpen]}
        items={getNodeBlockDefinitions()}
        onClick={(t) => {
          const node = createNode(
            {
              type: t.type,
              input: {},
            },
            newNodePosition
          );

          if (onConnectStartParams) {
            const { nodeId, handleId } = onConnectStartParams;
            if (!nodeId) return;
            const edge: Connection = {
              source: nodeId,
              target: node.id,
              sourceHandle: handleId,
              targetHandle: null,
            };

            const x = addEdge(edge, edgesModel.get() ?? []);
            edgesModel.set(x);
          }
        }}
      />

      <div
        className={clsx(
          "pointer-events-none fixed top-0 z-10 flex w-full flex-row items-start p-4"
        )}
      >
        <div className="pointer-events-auto flex flex-row items-center gap-2">
          <a
            className="group rounded-md border border-black bg-white p-0.5 shadow shadow-black hover:bg-black"
            onClick={() => void router.push("/home")}
          >
            <Image
              src="/logos/light-default-solid.svg"
              className="h-6 w-6 group-hover:invert"
              width="24"
              height="24"
              alt="Reworkd AI"
            />
          </a>
          <a
            className="mx-2 flex h-6 w-6 items-center justify-center rounded-md border border-black bg-white shadow-black transition-all hover:bg-black hover:text-white"
            onClick={() => void router.push("/")}
          >
            <RxHome size="16" />
          </a>
          {router.isReady && (
            <>
              <Select<{ id: string; name: string; role: string }>
                value={organization}
                items={session?.user.organizations}
                valueMapper={(org) => org?.name}
                icon={RiBuildingLine}
                defaultValue={
                  session?.user.organizations?.find((o) => {
                    return o.id === organization?.id;
                  }) || {
                    id: "default",
                    name: "Select an org",
                    role: "member",
                  }
                }
                onChange={changeOrg}
              />
              <Select<{ id: string; name: string }>
                value={workflows?.find((w) => w.id === router.query.w)}
                onChange={async (e) => {
                  if (e) await changeQueryParams({ w: e.id });
                }}
                items={workflows}
                valueMapper={(item) => item?.name}
                icon={RiStackFill}
                defaultValue={
                  workflows?.find((w) => w.id === workflowId) || {
                    id: "default",
                    name: "Select a workflow",
                  }
                }
              />
            </>
          )}
          {showCreateForm || (
            <FadeIn initialY={0} initialX={-50}>
              <div className="flex flex-row gap-1">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-black bg-white transition-all hover:bg-black hover:text-white"
                  onClick={() => void handleDeleteClick().catch(console.error)}
                >
                  <RxTrash size="16" />
                </a>
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-black bg-white transition-all hover:bg-black hover:text-white"
                  onClick={() => void handlePlusClick().catch(console.error)}
                >
                  <RxPlus size="16" />
                </a>
              </div>
            </FadeIn>
          )}
        </div>
        <div id="empty-space" className="flex-grow" />
        <div className="pointer-events-auto">
          {showCreateForm || (
            <AccountBar
              editors={members}
              onSave={handleSaveWorkflow}
              onShowLogs={() => {
                setLayout({
                  showLogSidebar: !layout.showLogSidebar,
                });
              }}
            />
          )}
        </div>
      </div>

      <div className="fixed right-0 top-16 z-10 flex flex-col items-center justify-between ">
        <WorkflowSidebar
          createNode={createNode}
          updateNode={updateNode}
          selectedNode={selectedNode}
          nodes={nodesModel.get() ?? []}
          edges={edgesModel.get() ?? []}
        />
      </div>
      <div className="fixed right-0 top-16 z-10 flex flex-col items-center justify-between ">
        <LogSidebar workflowId={workflowId} session={session} organizationId={organization?.id} />
      </div>

      {showCreateForm && (
        <div className="fixed right-1/2 top-1/2 z-10 -translate-y-1/2 translate-x-1/2">
          <CreateWorkflow onSubmit={onCreate} />
        </div>
      )}

      {showLoader && (
        <div className="fixed left-1/2 top-1/2 z-50">
          <Loader size={60} color="black" className="-translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      <AnimatePresence>
        {!showLoader && !showCreateForm && !nodesModel.get() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-dashed border-black p-8 text-lg font-light tracking-wider backdrop-blur-[2px]"
          >
            Double Click on the canvas to add a node
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-row overflow-x-hidden bg-white">
        <FlowChart
          controls={true}
          nodesModel={nodesModel}
          edgesModel={edgesModel}
          className="min-h-screen bg-[#F1F3F5]"
          setOnConnectStartParams={setOnConnectStartParams}
          onPaneDoubleClick={handlePaneDoubleClick}
        />
      </div>
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

const CreateWorkflow = ({ onSubmit }: { onSubmit: (name: string) => Promise<void> }) => {
  const [workflowName, setWorkflowName] = useState("");

  function submit() {
    if (!workflowName) {
      window.alert("Please enter a workflow name.");
      return;
    }

    onSubmit(workflowName).catch(console.error);
  }

  return (
    <div className="border-2 border-dashed border-black p-4 backdrop-blur-[2px] sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Create a new workflow</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter a short yet descriptive name for your workflow.</p>
        </div>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black/50 sm:text-sm sm:leading-6"
              placeholder="PDF Summary to Slack"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>
          <button
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface AccountBarProps {
  editors: Record<
    string,
    {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  >;
  onSave: () => Promise<void>;
  onShowLogs: () => void;
}

function AccountBar(props: AccountBarProps) {
  const editors = Object.entries(props.editors);

  return (
    <div className="flex h-10 flex-row items-center gap-4 rounded-md border border-black bg-white px-3 shadow shadow-black">
      <>
        <div className="flex flex-row-reverse">
          {editors.length === 0 && (
            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-400 ring-2 ring-blue-500 first:ring-purple-500" />
          )}
          {editors.map(([id, user]) => (
            <img
              className={clsx(
                "h-6 w-6 rounded-full border-2 border-white ring-2 ring-blue-500 first:ring-purple-500",
                editors.length > 1 && "-mr-2 first:ml-0"
              )}
              key={id}
              src={get_avatar(user)}
              alt="user avatar"
            />
          ))}
        </div>
        <div className="h-3 w-0.5 rounded-sm bg-gray-400/50" />
      </>
      <button
        className="h-6 rounded-lg border border-gray-500 bg-gray-100 px-2 text-sm font-light tracking-wider text-black transition-all hover:border hover:border-black hover:bg-white hover:text-black"
        onClick={props.onShowLogs}
      >
        Logs
      </button>
      <button
        className="h-6 rounded-lg border border-black bg-black px-2 text-sm font-light tracking-wider text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
        onClick={() => void props.onSave().catch(console.error)}
      >
        Save
      </button>
    </div>
  );
}
