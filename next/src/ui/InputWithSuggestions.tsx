import { Menu as MenuPrimitive } from "@headlessui/react";
import React from "react";
import type { Node } from "reactflow";

import Input from "./input";
import { MenuItems } from "../components/Menu";
import WindowButton from "../components/WindowButton";
import { useWorkflowStore } from "../stores/workflowStore";
import type { WorkflowNode } from "../types/workflow";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  attributes?: { [key: string]: string | number | string[] };
  helpText?: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  right?: React.ReactNode;
  suggestions: { key: string; value: string }[];
  value: string;
  currentNode: Node<WorkflowNode> | undefined;
}

interface Field {
  value?: string;
  key?: string;
}

const InputWithSuggestions = (props: Props) => {
  const [focused, setFocused] = React.useState(false);
  const { workflow, setInputs } = useWorkflowStore();
  const handleClick = (field: Field, label: string) => () => {
    const eventMock = {
      target: {
        value: `${field.key as string}`,
      },
    };

    if (workflow && props.currentNode) {
      setInputs(workflow, props.currentNode, {
        field: label,
        value: `${field.key as string}`,
      });
    }
    props.onChange && props.onChange(eventMock as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <Input
        label={props.name}
        name={props.name}
        helpText={props.helpText}
        value={props.value}
        onChange={props.onChange}
        handleFocusChange={(focus) => {
          if (focus) setFocused(true);
        }}
      />
      {props.suggestions.length > 0 && focused && (
        <MenuPrimitive>
          <div className="relative">
            <MenuItems
              buttonPosition="top"
              show
              items={props.suggestions.map((field, i) => (
                <WindowButton
                  key={`${props.name}-${field.key}`}
                  icon={<></>}
                  text={field.value}
                  onClick={handleClick(field, props.label)}
                />
              ))}
            />
          </div>
        </MenuPrimitive>
      )}
    </>
  );
};

export default InputWithSuggestions;
