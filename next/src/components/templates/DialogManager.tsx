import React, { useState } from "react";
import DialogBox from "./TemplateDialogBox";
import TemplateCard from "./TemplateCard";
import type { TemplateModel } from "./TemplateData";

type DialogManagerProps = {
  model: TemplateModel;
};

const DialogManager = ({ model }: DialogManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    console.log("Opening dialog");
    setIsDialogOpen(true);
  };
  

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {isDialogOpen && (
        <DialogBox
          name={model.name}
          promptTemplate={model.promptTemplate}
          category={model.category}
          onClose={closeDialog}
        />
      )}
      <TemplateCard model={model} onClick={openDialog} />
    </>
  );
};

export default DialogManager;
