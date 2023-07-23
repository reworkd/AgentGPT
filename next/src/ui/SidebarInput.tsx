import React from "react";

import InputWithSuggestions from "./InputWithSuggestions";
import type { IOField } from "../services/workflow/node-block-definitions";

interface SidebarInputProps {
  inputField: IOField;
  value: string;
  onChange: (value: string) => void;
  suggestions: { key: string; value: string }[];
}

const SidebarInput = ({ inputField, value, onChange, suggestions }: SidebarInputProps) => {
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

  if (inputField.type === "enum") {
    return <></>;
  }

  return <></>;
};

export default SidebarInput;
