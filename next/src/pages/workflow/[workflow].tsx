import { useState } from "react";
import { type NextPage } from "next";
import FlowChart from "../../components/workflow/Flowchart";
import { useWorkflow } from "../../hooks/useWorkflow";

import { useRouter } from "next/router";
import SidebarLayout from "../../layout/sidebar";

const WorkflowPage: NextPage = () => {
  const router = useRouter();

  const { nodesModel, edgesModel, saveWorkflow, createNode } = useWorkflow(
    router.query.workflow as string
  );

  // const [workflowNodeToCreate, setWorkflowNodeToCreate] = useState<
  //   CodeBlockWithFields | undefined
  // >();

  const [showModal, setShowModal] = useState(false);

  // const codeBlocks = trpc.blocks.getAll.useQuery();
  //
  // const handleAddNode = (block: CodeBlockWithFields) => {
  //   setShowModal(true);
  //   setWorkflowNodeToCreate(block);
  // };

  // const handleSave = async () => {
  //   const { id } = await saveWorkflow();
  //   await router.push(id);
  // };

  const title = (
    <h1 className="text-white">
      <span className="text-gray-500">Test/</span>
      CHANGE ME
    </h1>
  );

  return (
    <SidebarLayout>
      {/*<BlockMenu blocks={codeBlocks.data ? codeBlocks.data : []} handleAddNode={handleAddNode} />*/}
      {/*<Dialog*/}
      {/*  shouldOpen={showModal}*/}
      {/*  onOpenChange={setShowModal}*/}
      {/*  title={workflowNodeToCreate?.title}*/}
      {/*  description={workflowNodeToCreate?.description}*/}
      {/*  onSave={() => {*/}
      {/*    if (workflowNodeToCreate) {*/}
      {/*      createNode(workflowNodeToCreate);*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      <FlowChart
        controls={true}
        isLoading={false}
        // workflow={workflow}
        nodesModel={nodesModel}
        edgesModel={edgesModel}
        // onSave={handleSave}
        className="min-h-screen flex-1"
      />
    </SidebarLayout>
  );
};

export default WorkflowPage;
