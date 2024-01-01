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
          className="flex items-center gap-2 text-sm font-bold leading-6 text-slate-12"
        >
          {props.icon}
          <span>{props.label}</span>

          {props.type == "range" && (
            <span className="text-xs font-medium text-slate-12 lg:text-sm">({props.value})</span>
          )}
        </label>
      )}
      <div className="relative flex flex-col gap-1 rounded-md shadow-sm">
        {props.helpText && (
          <p
            className="text-xs font-light text-slate-11 lg:text-sm"
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
              "placeholder:text-color-tertiary focus:outline-inset block w-full rounded-md border-0 bg-slate-1 p-1.5 text-slate-12 shadow-depth-1 transition-colors sm:text-sm sm:leading-6"
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
