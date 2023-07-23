import clsx from "clsx";
import type { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";

export interface Props extends ButtonHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  model: [boolean, Dispatch<SetStateAction<boolean>>];
  className?: string;
}

function Checkbox(props: Props) {
  return (
    <div className={clsx("relative flex items-start", props.className)}>
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={props.model[0]}
          onChange={(e) => props.model[1](e.target.checked)}
        />
      </div>
      <div className="ml-3 text-sm leading-6 text-gray-400">
        {props.label && <label className="font-medium">{props.label}</label>}
      </div>
    </div>
  );
}

export default Checkbox;
