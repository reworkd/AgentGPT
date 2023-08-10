import type { FC } from "react";
import { FaBars } from "react-icons/fa";
import type { Edge, Node } from "reactflow";

import { SidebarTransition } from "./Sidebar";
import type { createNodeType, updateNodeType } from "../../hooks/useWorkflow";
import { findParents } from "../../services/graph-utils";
import type { IOField, NodeBlockDefinition } from "../../services/workflow/node-block-definitions";
import {
  getNodeBlockDefinitionFromNode,
  getNodeBlockDefinitions,
} from "../../services/workflow/node-block-definitions";
import { useConfigStore } from "../../stores/configStore";
import type { WorkflowEdge, WorkflowNode } from "../../types/workflow";
import WorkflowSidebarInput from "../../ui/WorkflowSidebarInput";
import { useWorkflowStore } from "../../stores/workflowStore";

type WorkflowControls = {
  selectedNode: Node<WorkflowNode> | undefined;
  nodes: Node<WorkflowNode>[];
  edges: Edge<WorkflowEdge>[];
  createNode: createNodeType;
  updateNode: updateNodeType;
};

const WorkflowSidebar: FC<WorkflowControls> = (controls) => {
  const { layout, setLayout } = useConfigStore();

  const setShow = (show: boolean) => {
    setLayout({ showRightSidebar: show });
  };

  return (
    <SidebarTransition
      show={layout.showRightSidebar}
      side="right"
      className="mr-3.5 rounded-lg bg-black p-6 shadow-xl shadow-stone-400"
    >
      <div className="text-color-primary flex h-[80vh] w-64 flex-col gap-2  bg-black">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(false)}
          >
            <FaBars size="15" className="z-20 mr-2" />
          </button>
          <div />
        </div>
        <InspectSection {...controls} />
      </div>
    </SidebarTransition>
  );
};

type InspectSectionProps = {
  selectedNode: Node<WorkflowNode> | undefined;
  updateNode: updateNodeType;
  nodes: Node<WorkflowNode>[];
  edges: Edge<WorkflowEdge>[];
};

const InspectSection = ({ selectedNode, updateNode, nodes, edges }: InspectSectionProps) => {
  const { workflow, setInputs } = useWorkflowStore();

  if (selectedNode == undefined)
    return (
      <div className="text-sm font-light">
        No components selected. Click on a component to select it
      </div>
    );

  const definition = getNodeBlockDefinitionFromNode(selectedNode);

  const handleValueChange = (name: string, value: string) => {
    const updatedNode = { ...selectedNode };
    updatedNode.data.block.input[name] = value;
    updateNode(updatedNode);

    // if (!value.includes(".result")) {
    //   // @ts-ignore
    //   setInputs(workflow, selectedNode, { field: name, value: value })
    //   const updatedNode = { ...selectedNode };
    //   updatedNode.data.block.input[name] = value;
    //   updateNode(updatedNode);
    // }
    // else {
    //   const updatedNode = { ...selectedNode };
    //   updatedNode.data.block.input[name] = value;
    //   updateNode(updatedNode);
    // }
  };

  const outputFields = findParents(nodes, edges, selectedNode).flatMap((ancestorNode) => {
    const definition = getNodeBlockDefinitionFromNode(ancestorNode);
    if (definition == undefined) return [];

    const outputFields = definition.output_fields;
    return outputFields.map((outputField) => ({
      key: `{{${ancestorNode.id}.${outputField.name}}}`,
      value: `${definition.type}.${outputField.name}`,
    }));
  });

  const handleAutocompleteClick = (inputField: IOField, field: { key: string; value: string }) => {
    handleValueChange(
      inputField.name,
      `${selectedNode.data.block.input[inputField.name] || ""}{{${field.key}}}`
    );
  };

  return (
    <>
      <div>
        <p className="text-lg font-bold">{definition?.type}</p>
        <p className="mb-3 text-sm font-thin">{definition?.description}</p>
      </div>
      <hr className="border-neutral-500" />
      <div className="font-bold">Inputs</div>
      {definition?.input_fields.map((inputField: IOField) => (
        <div key={definition?.type + inputField.name}>
          <WorkflowSidebarInput
            inputField={inputField}
            node={selectedNode}
            onChange={(val) => handleValueChange(inputField.name, val)}
            suggestions={outputFields}
          />
        </div>
      ))}
      {definition?.input_fields.length == 0 && (
        <p className="text-sm font-thin">This node does not take any input.</p>
      )}
      <hr className="border-neutral-500" />
      <div className="font-bold">Outputs</div>
      <div className="flex flex-col gap-2">
        {definition?.output_fields.map((outputField: IOField) => (
          <div key={definition?.type + outputField.name}>
            <p>
              <span className="text-sm font-bold">{outputField.name}:</span>{" "}
              <span className="text-sm">{outputField.type}</span>
            </p>
            <p className="text-sm font-thin">{outputField.description}</p>
          </div>
        ))}
        {definition?.output_fields.length == 0 && (
          <p className="text-sm font-thin">This node does not have any output.</p>
        )}
      </div>
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
      className="flex cursor-pointer flex-col gap-2 rounded-md border border-white/20 p-2 hover:bg-white/10 "
      onClick={() => {
        const input: Record<string, string> = {};
        for (const field of definition.input_fields) {
          input[field.name] = "";
        }

        createNode({ input: input, type: definition.type }, { x: 0, y: 0 });
      }}
    >
      <div className="flex items-center gap-2">
        <definition.icon size={17} />
        <h3 className="font-medium">{definition.type}</h3>
      </div>
      <p className="text-sm font-thin">{definition.description}</p>
    </div>
  );
};

export default WorkflowSidebar;
