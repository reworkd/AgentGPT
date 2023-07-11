import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import React from "react";
import { FaBars } from "react-icons/fa";
import type { NodeBlockDefinition } from "../../services/workflow/node-block-definitions";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";

type WorkflowControls = {
  createNode: () => void;
};

type WorkflowSidebarProps = DisplayProps & WorkflowControls;

// Wrapper HOC to curry the createNode function
export const getWorkflowSidebar = (createNode: () => void) => {
  const WorkflowSidebarHOC = ({ show, setShow }: DisplayProps) => (
    <WorkflowSidebar show={show} setShow={setShow} createNode={createNode} />
  );
  WorkflowSidebarHOC.displayName = "WorkflowSidebarHOC";
  return WorkflowSidebarHOC;
};

const WorkflowSidebar = ({ show, setShow, createNode }: WorkflowSidebarProps) => {
  return (
    <Sidebar show={show} setShow={setShow} side="right">
      <div className="flex h-screen flex-col gap-2 text-white">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(!show)}
          >
            <FaBars size="15" className="z-20 m-2" />
          </button>
          <div className="ml-5 font-bold">Block</div>
        </div>
        {getNodeBlockDefinitions().map((nodeBlockDefinition) => (
          <NodeBlock
            key={nodeBlockDefinition.type}
            definition={nodeBlockDefinition}
            createNode={createNode}
          />
        ))}
      </div>
    </Sidebar>
  );
};

type NodeBlockProps = {
  definition: NodeBlockDefinition;
  createNode: () => void;
};
const NodeBlock = ({ definition, createNode }: NodeBlockProps) => {
  return (
    <div
      className="flex cursor-pointer flex-row gap-2 rounded-md border border-white/20 p-2 hover:bg-white/10"
      onClick={() => createNode()}
    >
      <img src={definition.image_url} alt={definition.type} width={30} height={30} />
      <div className="flex-shrink">
        <h3 className="font-medium">{definition.type}</h3>
        <p className="text-sm font-thin">{definition.description}</p>
      </div>
    </div>
  );
};
