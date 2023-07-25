import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { InputHTMLAttributes, ReactNode } from "react";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

import WorkflowApi from "../services/workflow/workflowApi";
import { useWorkflowStore } from "../stores/workflowStore";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name?: string;
  helpText?: string | React.ReactNode;
  icon?: ReactNode;
  node_ref?: string | undefined;
}

const Dropzone = (props: Props) => {
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const workflow = useWorkflowStore.getState();

  const { mutateAsync: uploadFiles } = useMutation(async (files: File[]) => {
    if (!files.length || !workflow?.workflow?.id || !props.node_ref) return;
    await new WorkflowApi(session?.accessToken).upload(workflow.workflow.id, props.node_ref, files);
  });

  return (
    <div className="flex w-full flex-col  justify-center">
      {props.label && (
        <label
          htmlFor={props.name}
          className="text-color-primary flex items-center gap-2 text-sm font-bold leading-6"
        >
          {props.icon}
          <span className="capitalize">{props.label}</span>
        </label>
      )}
      {props.helpText && (
        <p className="text-color-secondary text-xs font-extralight lg:text-sm">{props.helpText}</p>
      )}
      <label
        htmlFor="dropzone-file"
        className="background-color-7 border-style-1 mt-1 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border hover:bg-neutral-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <FaCloudUploadAlt size="60" className="text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload PDFs</span>
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files || []);

            setFiles(files);
            uploadFiles(files).catch(console.error);
          }}
        />
      </label>
      {files.map((file, i) => (
        <div key={i}>{file.name}</div>
      ))}
    </div>
  );
};

export default Dropzone;
