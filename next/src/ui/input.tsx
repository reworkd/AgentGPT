import clsx from "clsx";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  attributes?: { [key: string]: string | number | string[] };
  helpText?: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  right?: React.ReactNode;
  handleFocusChange?: (focused: boolean) => void;
}

const Input = (props: Props) => {
  return (
    <div>
      {props.label && (
        <label
          htmlFor={props.name}
          className="text-color-primary flex items-center gap-2 text-sm font-bold leading-6"
        >
          {props.icon}
          <span>{props.label}</span>

          {props.type == "range" && (
            <span className="text-color-primary text-xs font-medium lg:text-sm">
              ({props.value})
            </span>
          )}
        </label>
      )}
      <div className="relative flex flex-col gap-1 rounded-md shadow-sm">
        {props.helpText && (
          <p
            className="text-color-secondary text-xs font-extralight lg:text-sm"
            id={`${props.name}-description`}
          >
            {props.helpText}
          </p>
        )}
        <div className="flex flex-grow flex-row items-center gap-1">
          <input
            type={props.type}
            name={props.name}
            id={props.name}
            className={clsx(
              "text-color-primary background-color-7 placeholder:text-color-tertiary focus:outline-inset border-focusVisible-1 border-style-1 block w-full rounded-md p-1 shadow-sm transition-colors sm:text-sm sm:leading-6"
            )}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            onFocus={() => props.handleFocusChange && props.handleFocusChange(true)}
            onBlur={() => props.handleFocusChange && props.handleFocusChange(false)}
            {...(props.helpText ? { "aria-describedby": `${props.name}-description` } : {})}
            {...props.attributes}
          />
          {props.right}
        </div>
      </div>
    </div>
  );
};

export default Input;
