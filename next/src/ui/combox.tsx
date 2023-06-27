import type { ReactNode } from "react";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronDown } from "react-icons/hi2";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
      <Combobox.Label className="flex items-center gap-1 text-sm font-bold leading-6 text-gray-900 dark:text-white">
        {props.label}
        {props.icon}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-900 dark:text-white dark:ring-gray-400 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(e) => props.valueMapper(e as T)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <HiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((e, i) => (
              <Combobox.Option
                key={i}
                value={e}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames("block truncate", selected && "font-semibold")}>
                      {props.valueMapper(e)}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
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
