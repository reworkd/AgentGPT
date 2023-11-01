import clsx from "clsx";
import type { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";

import Label from "./Label";
import type { toolTipProperties } from "../types";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  small?: boolean; // Will lower padding and font size. Currently only works for the default input
  left?: ReactNode;
  value: string | number | undefined;
  onChange: (e: ChangeEvent<InputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  subType?: string;
  attributes?: { [key: string]: string | number | string[] }; // attributes specific to input type
  toolTipProperties?: toolTipProperties;
  inputRef?: RefObject<InputElement>;
  onKeyDown?: (e: KeyboardEvent<InputElement>) => void;
}

const Input = (props: InputProps) => {
  const isTypeTextArea = () => {
    return props.type === "textarea";
  };

  return (
    <div className="items-left z-5 flex h-fit w-full flex-col rounded-xl text-lg text-slate-12 md:flex-row md:items-center">
      {props.left && (
        <Label left={props.left} type={props.type} toolTipProperties={props.toolTipProperties} />
      )}
      {isTypeTextArea() ? (
        <textarea
          className={clsx(
            "delay-50 h-15 w-full resize-none rounded-xl border-2 border-slate-7 bg-slate-1 p-2 text-sm tracking-wider text-slate-12 outline-none transition-all selection:bg-sky-300 placeholder:text-slate-8 hover:border-sky-200 focus:border-sky-400 sm:h-20 md:text-lg",
            props.disabled && "cursor-not-allowed",
            props.left && "md:rounded-l-none",
            props.small && "text-sm sm:py-[0]"
          )}
          ref={props.inputRef as RefObject<HTMLTextAreaElement>}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          {...props.attributes}
        />
      ) : (
        <input
          className={clsx(
            "w-full rounded-xl border-2 border-slate-7 bg-slate-1 p-2 py-1 text-sm tracking-wider text-slate-12 outline-none transition-all duration-200 selection:bg-sky-300 placeholder:text-slate-8 hover:border-sky-200 focus:border-sky-400 sm:py-3 md:text-lg",
            props.disabled && "cursor-not-allowed",
            props.left && "md:rounded-l-none",
            props.small && "text-sm sm:py-[0]"
          )}
          ref={props.inputRef as RefObject<HTMLInputElement>}
          placeholder={props.placeholder}
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          {...props.attributes}
        />
      )}
    </div>
  );
};

export default Input;
