import React from "react";
interface Props<T> {
  label: string;
  value: T | undefined;
  name: string;
  type: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  attributes?: { [key: string]: string | number | string[] }
  helpText?: string;
  placeholder?: string;
}

const Input = <T, > ({ ...props }: Props<T>) => {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={props.placeholder}
          onChange={props.onChange}
          {...(props.helpText ? {'aria-describedby': `${props.name}-description`} : {})}
          {...props.attributes}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" id={`${props.name}-description`}>
        {props.helpText}
      </p>
    </div>
  )
}

export default Input;
