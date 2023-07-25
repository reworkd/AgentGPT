import React from "react";

import Dialog from "../../ui/dialog";
import Input from "../../ui/input";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";

const CreateWorkflowDialog = ({
  createWorkflow,
  showDialog,
  setShowDialog,
}: {
  createWorkflow: (name: string, description: string) => void;
  showDialog: boolean;
  setShowDialog: (boolean) => void;
}) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const handleCreate = () => {
    if (name === "" || description === "") {
      setIsError(true);
      return;
    }

    setIsError(false);
    createWorkflow(name, description);
    setShowDialog(false);
  };

  return (
    <Dialog
      inline
      open={showDialog}
      setOpen={setShowDialog}
      title="Create a new workflow"
      icon={<></>}
      actions={
        <>
          <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          name="description"
          label="Description"
          placeholder="An explanation of what the workflow does"
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

export default CreateWorkflowDialog;
