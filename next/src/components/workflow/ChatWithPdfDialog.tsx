import {Dialog, Transition } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";
import ChatWithPdfComponent from "../pdf/ChatWithPdf";

interface Props {
    openModel: [boolean, Dispatch<SetStateAction<boolean>>];
}

export default function ChatWithPDFDialog({ openModel }: Props) {
    const [query, setQuery] = useState("");

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
                <div className="relative z-10 flex items-center justify-center h-screen">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-xl transform divide-y divide-gray-100 rounded-xl bg-white transition-all">
                            <ChatWithPdfComponent></ChatWithPdfComponent>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
