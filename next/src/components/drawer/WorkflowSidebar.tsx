import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import React from "react";
import { FaBars } from "react-icons/fa";
import type { NodeBlockDefinition } from "../../services/workflow/node-block-definitions";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";
import type { createNodeType, updateNodeType } from "../../hooks/useWorkflow";
import type { WorkflowNode } from "../../types/workflow";
import type { Node } from "reactflow";

type WorkflowControls = {
  selectedNode: Node<WorkflowNode> | undefined;
  createNode: createNodeType;
  updateNode: updateNodeType;
};

type WorkflowSidebarProps = DisplayProps & {
  controls: WorkflowControls;
};

// Wrapper HOC to curry the createNode function
export const getWorkflowSidebar = (controls: WorkflowControls) => {
  const WorkflowSidebarHOC = ({ show, setShow }: DisplayProps) => (
    <WorkflowSidebar show={show} setShow={setShow} controls={controls} />
  );
  WorkflowSidebarHOC.displayName = "WorkflowSidebarHOC";
  return WorkflowSidebarHOC;
};

const WorkflowSidebar = ({ show, setShow, controls }: WorkflowSidebarProps) => {
  return (
    <Sidebar show={show} setShow={setShow} side="right">
      <div className="text-color-primary flex h-screen flex-col gap-2">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(!show)}
          >
            <FaBars size="15" className="z-20 m-2" />
          </button>
          <div className="ml-5 font-bold">Block</div>
        </div>
        <InspectSection selectedNode={controls.selectedNode} updateNode={controls.updateNode} />
        <CreateSection createNode={controls.createNode} />
      </div>
    </Sidebar>
  );
};

type InspectSectionProps = {
  selectedNode: Node<WorkflowNode> | undefined;
  updateNode: updateNodeType;
};

const InspectSection = ({ selectedNode, updateNode }: InspectSectionProps) => {
  if (selectedNode == undefined)
    return <div>No components selected. Click on a component to select it</div>;

  return (
    <>
      <div>We selected something!</div>
      <div>{selectedNode.data.block.type}</div>
    </>
  );
};

type CreateSectionProps = {
  createNode: createNodeType;
};

const CreateSection = ({ createNode }: CreateSectionProps) => {
  return (
    <>
      {getNodeBlockDefinitions().map((nodeBlockDefinition) => (
        <NodeBlock
          key={nodeBlockDefinition.type}
          definition={nodeBlockDefinition}
          createNode={createNode}
        />
      ))}
    </>
  );
};

type NodeBlockProps = {
  definition: NodeBlockDefinition;
  createNode: createNodeType;
};
const NodeBlock = ({ definition, createNode }: NodeBlockProps) => {
  return (
    <div
      className="flex cursor-pointer flex-row gap-2 rounded-md border border-white/20 p-2 hover:bg-white/10"
      onClick={() =>
        createNode({ input: { url: "www.ThisIsARandomTestUrl.com" }, type: definition.type })
      }
    >
      <div className="h-[30px] w-[30px]">
        <img src={definition.image_url} alt={definition.type} width={30} />
      </div>
      <div>
        <h3 className="font-medium">{definition.type}</h3>
        <p className="text-sm font-thin">{definition.description}</p>
      </div>
    </div>
  );
};
