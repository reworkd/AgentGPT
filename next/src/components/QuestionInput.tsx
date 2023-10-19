import clsx from "clsx";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  attributes?: { [key: string]: string | number | string[] };
  icon?: React.ReactNode;
  disabled?: boolean;
  handleFocusChange?: (focused: boolean) => void;
  onSubmit: () => void;
}

// Test stylized input component
const QuestionInput = (props: Props) => {
  return (
    <div className="relative flex flex-col">
      <div className="flex flex-grow flex-row items-center gap-1">
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="placeholder:text-color-tertiary w-full rounded-full border-2 border-slate-6 bg-slate-1 p-4 text-slate-12 caret-purple-400 ring-0 transition-colors duration-300 selection:bg-purple-300 hover:border-purple-200 focus:border-purple-400 focus:outline-0 focus:ring-0  sm:leading-6"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          onFocus={() => props.handleFocusChange && props.handleFocusChange(true)}
          onBlur={() => props.handleFocusChange && props.handleFocusChange(false)}
          {...{ "aria-describedby": `${props.name}-description` }}
          {...props.attributes}
        />
        <div
          className={clsx(
            "absolute right-2 rounded-full p-3 text-white transition-colors duration-300",
            props.value === ""
              ? "cursor-not-allowed bg-slate-8"
              : "cursor-pointer bg-purple-300 hover:bg-purple-400"
          )}
          onClick={props.onSubmit}
        >
          <FaArrowRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;
