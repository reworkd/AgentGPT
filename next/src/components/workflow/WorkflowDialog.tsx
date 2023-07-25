import React, { useEffect } from "react";

import type { WorkflowMeta } from "../../services/workflow/workflowApi";
import Dialog from "../../ui/dialog";
import Input from "../../ui/input";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";

const WorkflowDialog = ({
  workflow,
  openWorkflow,
  showDialog,
  setShowDialog,
}: {
  workflow: WorkflowMeta | null;
  openWorkflow: () => void;
  showDialog: boolean;
  setShowDialog: (boolean) => void;
}) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    if (!workflow) return;

    setName(workflow.name);
    setDescription(workflow.description);
  }, [workflow]);

  return (
    <Dialog
      inline
      open={showDialog}
      setOpen={setShowDialog}
      title="View existing workflow"
      icon={<></>}
      actions={
        <>
          <PrimaryButton onClick={() => openWorkflow()}>Open</PrimaryButton>
          <TextButton onClick={() => setShowDialog(false)}>Close</TextButton>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          name="name"
          label="Name"
          className="rounded-sm"
          placeholder="My new workflow"
          disabled
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          name="description"
          label="Description"
          placeholder="An explanation of what the workflow does"
          disabled
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isError && (
          <p className="text-sm font-semibold text-red-500">
            Please provide a name and a description
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default WorkflowDialog;
