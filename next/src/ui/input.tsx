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
}

const Input = ({ ...props }: Props) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="mt-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >
        {props.label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-transparent sm:text-sm sm:leading-6"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          {...(props.helpText ? { "aria-describedby": `${props.name}-description` } : {})}
          {...props.attributes}
        />
      </div>
      {props.helpText && (
        <p className="text-sm text-gray-500 dark:text-gray-400" id={`${props.name}-description`}>
          {props.helpText}
        </p>
      )}
    </div>
  );
};

export default Input;
