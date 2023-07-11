import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import React from "react";
import { FaBars } from "react-icons/fa";
import type { NodeBlockDefinition } from "../../services/workflow/node-block-definitions";
import { getNodeBlockDefinitions } from "../../services/workflow/node-block-definitions";

const WorkflowSidebar = ({ show, setShow }: DisplayProps) => {
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
          <NodeBlock key={nodeBlockDefinition.type} definition={nodeBlockDefinition} />
        ))}
      </div>
    </Sidebar>
  );
};

type NodeBlockProps = {
  definition: NodeBlockDefinition;
};
const NodeBlock = ({ definition }: NodeBlockProps) => {
  return (
    <div className="flex flex-row gap-2 rounded-md border border-white/20 p-2">
      <img src={definition.image_url} alt={definition.type} width={30} height={30} />
      <div className="flex-shrink">
        <h3 className="font-medium">{definition.type}</h3>
        <p className="text-sm font-thin">{definition.description}</p>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
