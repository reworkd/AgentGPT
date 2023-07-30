import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import type { IconType } from "react-icons";
import { FaCheck, FaChevronDown } from "react-icons/fa";

interface Props<T> {
  value?: T;
  onChange?: (value: T | undefined) => void | Promise<void>;
  items?: T[];
  valueMapper?: (item?: T) => string | undefined;
  icon: IconType;
  disabled?: boolean;
  defaultValue: T;
}

export default function Select<T>(props: Props<T>) {
  return (
    <Listbox
      value={props.value || props.defaultValue}
      onChange={props.onChange}
      disabled={props.disabled}
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button
              className={clsx(
                "relative w-full cursor-default rounded-md border border-neutral-500 bg-white p-1 px-2 text-left text-gray-900 shadow-sm ring-2 ring-inset ring-black focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6",
                props.disabled && "cursor-not-allowed bg-neutral-300 text-neutral-700"
              )}
            >
              <span className="flex flex-row items-center">
                {props.icon({})}
                <span className="ml-2 block flex-grow truncate capitalize">
                  {props.valueMapper?.(props.value || props.defaultValue)}
                </span>
                <FaChevronDown className="h-5 w-5 pl-2 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {props.items?.map((item, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span
                            className={clsx(selected && "font-semibold", "truncate capitalize")}
                          >
                            {props.valueMapper?.(item)}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <FaCheck className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
