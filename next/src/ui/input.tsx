import React from "react";

interface Props {
  label: string;
  value: string | number | readonly string[] | undefined;
  name: string;
  type: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  attributes?: { [key: string]: string | number | string[] };
  helpText?: string | null;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Input = ({ ...props }: Props) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="text-color-primary flex items-center gap-2 text-sm font-bold leading-6"
      >
        <span>{props.label}</span>
        {props.icon}
        {props.type == "range" && (
          <span className="text-color-secondary text-xs font-thin lg:text-sm">({props.value})</span>
        )}
      </label>
      <div className="relative rounded-md shadow-sm">
        {props.helpText && (
          <p
            className="text-color-secondary text-xs font-thin lg:text-sm"
            id={`${props.name}-description`}
          >
            {props.helpText}
          </p>
        )}
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="text-color-primary placeholder:text-color-tertiary focus:outline-inset block w-full rounded-md border-0 py-1.5 shadow-sm focus:outline-2 focus:outline-indigo-600 dark:border-transparent sm:text-sm sm:leading-6"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          {...(props.helpText ? { "aria-describedby": `${props.name}-description` } : {})}
          {...props.attributes}
        />
      </div>
    </div>
  );
};

export default Input;
