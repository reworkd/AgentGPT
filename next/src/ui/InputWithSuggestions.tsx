import React from "react";
import Input from "./input";
import { MenuItems } from "../components/Menu";
import { Menu as MenuPrimitive } from "@headlessui/react";

import WindowButton from "../components/WindowButton";

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
}

const InputWithSuggestions = (props: Props) => {
  const [focused, setFocused] = React.useState(false);

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
                  onClick={() => {
                    const eventMock = {
                      target: {
                        value: `${props.value}${field.key}`,
                      },
                    };
                    // @ts-ignore
                    props.onChange && props.onChange(eventMock);
                  }}
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
