import { Combobox, Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { NodeBlockDefinition } from "../../services/workflow/node-block-definitions";

interface Props {
  openModel: [boolean, Dispatch<SetStateAction<boolean>>];
  items: NodeBlockDefinition[];
  onClick: (value: NodeBlockDefinition) => void;
}

export default function BlockDialog({ items, openModel, onClick }: Props) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={openModel[0]} as={Fragment} afterLeave={() => setQuery("")} appear>
      <Dialog as="div" className="relative z-10" onClose={openModel[1]}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-all" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(t) => {
                  onClick(t as NodeBlockDefinition);
                  openModel[1](false);
                }}
              >
                <div className="relative">
                  <FaSearch
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredItems.length > 0 && (
                  <Combobox.Options static className="max-h-[60vh] scroll-py-3 overflow-y-auto p-3">
                    {filteredItems.map((item) => (
                      <Combobox.Option
                        key={item.name}
                        value={item}
                        className={({ active }) =>
                          clsx(
                            "flex cursor-default select-none rounded-xl p-3",
                            active && "bg-gray-100"
                          )
                        }
                      >
                        {({ active }) => (
                          <div className="flex flex-row">
                            <div
                              className={clsx(
                                "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                                item?.color || "bg-orange-500"
                              )}
                            >
                              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="ml-4 flex-auto">
                              <p
                                className={clsx(
                                  "text-sm font-medium",
                                  active ? "text-gray-900" : "text-gray-700"
                                )}
                              >
                                {item.name}
                              </p>
                              <p
                                className={clsx(
                                  "text-sm",
                                  active ? "text-gray-700" : "text-gray-500"
                                )}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}

                {query !== "" && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <FaSearch
                      type="outline"
                      name="exclamation-circle"
                      className="mx-auto h-6 w-6 text-gray-400"
                    />
                    <p className="mt-4 font-semibold text-gray-900">No results found</p>
                    <p className="mt-2 text-gray-500">
                      No Blocks found for this search term. Please try again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
