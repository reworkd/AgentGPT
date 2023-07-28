import React from "react";
import type { Node } from "reactflow";

import Combo from "./combox";
import Dropzone from "./dropzone";
import InputWithSuggestions from "./InputWithSuggestions";
import type { IOField } from "../services/workflow/node-block-definitions";
import type { WorkflowNode } from "../types/workflow";

interface SidebarInputProps {
  inputField: IOField;
  onChange: (value: string) => void;
  suggestions: { key: string; value: string }[];
  node: Node<WorkflowNode> | undefined;
}

const WorkflowSidebarInput = ({ inputField, onChange, suggestions, node }: SidebarInputProps) => {
  if (inputField.type === "string" && inputField.enum) {
    return (
      <Combo
        label={inputField.name}
        items={inputField.enum}
        value={node?.data?.block?.input[inputField.name] || ""}
        valueMapper={(e) => e}
        onChange={(e) => onChange(e)}
      />
    );
  }
  if (inputField.type === "string") {
    return (
      <>
        <InputWithSuggestions
          label={inputField.name}
          name={inputField.name}
          helpText={inputField.description}
          value={node?.data?.block?.input[inputField.name] || ""}
          onChange={(e) => onChange(e.target.value)}
          suggestions={suggestions}
        />
      </>
    );
  }
  if (inputField.type === "file") {
    return (
      <Dropzone
        label={inputField.name}
        helpText={inputField.description}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        node_ref={node?.data.ref}
      />
    );
  }

  return <></>;
};

export default WorkflowSidebarInput;
