import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import React from "react";
import { FaBars } from "react-icons/fa";
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
          <div className="ml-5 font-bold">Nodes</div>
        </div>
        {getNodeBlockDefinitions().map((nodeDefinition) => (
          <div key={nodeDefinition.type} className="ml-5 font-bold">
            {nodeDefinition.type}
          </div>
        ))}
      </div>
    </Sidebar>
  );
};

export default WorkflowSidebar;
