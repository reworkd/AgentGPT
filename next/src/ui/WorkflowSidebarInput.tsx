import React from "react";

import Combo from "./combox";
import Dropzone from "./dropzone";
import InputWithSuggestions from "./InputWithSuggestions";
import type { IOField } from "../services/workflow/node-block-definitions";

interface SidebarInputProps {
  inputField: IOField;
  value: string;
  onChange: (value: string) => void;
  suggestions: { key: string; value: string }[];
}

const WorkflowSidebarInput = ({ inputField, value, onChange, suggestions }: SidebarInputProps) => {
  if (inputField.type === "string" && inputField.enum) {
    return (
      <Combo
        label={inputField.name}
        items={inputField.enum}
        value={value}
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
          value={value}
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
      />
    );
  }

  return <></>;
};

export default WorkflowSidebarInput;
