import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import React from "react";
import { FaBars } from "react-icons/fa";
import type { IOField, NodeBlockDefinition } from "../../services/workflow/node-block-definitions";
import {
  getNodeBlockDefinitionFromNode,
  getNodeBlockDefinitions,
} from "../../services/workflow/node-block-definitions";
import type { createNodeType, updateNodeType } from "../../hooks/useWorkflow";
import type { WorkflowEdge, WorkflowNode } from "../../types/workflow";
import type { Edge, Node } from "reactflow";
import TextButton from "../TextButton";
import { findParents } from "../../services/graph-utils";
import InputWithSuggestions from "../../ui/InputWithSuggestions";

type WorkflowControls = {
  selectedNode: Node<WorkflowNode> | undefined;
  nodes: Node<WorkflowNode>[];
  edges: Edge<WorkflowEdge>[];
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
  const [tab, setTab] = React.useState<"inspect" | "create">("inspect");

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
          <TextButton onClick={() => setTab("inspect")}>Inspect</TextButton>
          <TextButton onClick={() => setTab("create")}>Create</TextButton>
          <div />
        </div>
        {tab === "inspect" && <InspectSection {...controls} />}
        {tab === "create" && <CreateSection createNode={controls.createNode} />}
      </div>
    </Sidebar>
  );
};

type InspectSectionProps = {
  selectedNode: Node<WorkflowNode> | undefined;
  updateNode: updateNodeType;
  nodes: Node<WorkflowNode>[];
  edges: Edge<WorkflowEdge>[];
};

const InspectSection = ({ selectedNode, updateNode, nodes, edges }: InspectSectionProps) => {
  if (selectedNode == undefined)
    return <div>No components selected. Click on a component to select it</div>;

  const definition = getNodeBlockDefinitionFromNode(selectedNode);

  const handleValueChange = (name: string, value: string) => {
    const updatedNode = { ...selectedNode };
    updatedNode.data.block.input[name] = value;
    updateNode(updatedNode);
  };

  const outputFields = findParents(nodes, edges, selectedNode).flatMap((ancestorNode) => {
    const definition = getNodeBlockDefinitionFromNode(ancestorNode);
    if (definition == undefined) return [];

    const outputFields = definition.output_fields;
    return outputFields.map((outputField) => {
      return {
        key: `${ancestorNode.id}-${outputField.name}`,
        value: `${definition.type}-${outputField.name}`,
      };
    });
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
      {definition?.input_fields.map((inputField) => (
        <div key={definition?.type + inputField.name}>
          <InputWithSuggestions
            label={inputField.name}
            name={inputField.name}
            helpText={inputField.description}
            value={selectedNode.data.block.input[inputField.name] || ""}
            onChange={(e) => handleValueChange(inputField.name, e.target.value)}
            suggestions={outputFields}
          />
        </div>
      ))}
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
      onClick={() => {
        const input: Record<string, string> = {};
        for (const field of definition.input_fields) {
          input[field.name] = "";
        }

        createNode({ input: input, type: definition.type });
      }}
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

export default WorkflowSidebar;
