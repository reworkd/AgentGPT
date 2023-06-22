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
  helpText?: string | React.ReactNode;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Input = ({ ...props }: Props) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="flex items-center gap-2 text-sm font-bold leading-6 text-gray-900 dark:text-white"
      >
        <span>{props.label}</span>
        {props.icon}
        {props.type == "range" && (
          <span className="text-xs font-thin text-gray-300 lg:text-sm">({props.value})</span>
        )}
      </label>
      <div className="relative flex flex-col gap-1 rounded-md shadow-sm">
        {props.helpText && (
          <p
            className="text-xs font-thin text-gray-500 dark:text-gray-400 lg:text-sm"
            id={`${props.name}-description`}
          >
            {props.helpText}
          </p>
        )}
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="block w-full rounded-md border-0 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-transparent sm:text-sm sm:leading-6"
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
