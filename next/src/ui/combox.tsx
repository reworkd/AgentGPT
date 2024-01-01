import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { HiCheck, HiChevronDown } from "react-icons/hi2";

interface Props<T> {
  label: string;
  items: T[];
  value: T | undefined;
  valueMapper: (e: T) => string;
  onChange: (value: T) => void;
  icon?: ReactNode;
}

const Combo = <T,>({ items, ...props }: Props<T>) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? items
      : items.filter((e) => props.valueMapper(e).toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox as="div" value={props.value} onChange={props.onChange}>
      <Combobox.Label className="flex items-center gap-2 text-sm font-bold leading-6 text-slate-12">
        {props.icon}
        {props.label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-slate-1 py-1.5 pl-3 pr-10 text-slate-12 shadow-depth-1 transition-colors sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(e) => props.valueMapper(e as T)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <HiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-1 py-1 text-slate-12 shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((e, i) => (
              <Combobox.Option
                key={i}
                value={e}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9 ",
                    active ? "hover:bg-slate-3" : "text-slate-12"
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span className={clsx("block truncate", selected && "font-semibold")}>
                      {props.valueMapper(e)}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 right-0 flex items-center pr-4 text-slate-12"
                        )}
                      >
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Combo;
