import React, { useState } from "react";
import clsx from "clsx";
import type { TemplateModel } from "./TemplateData";
import TemplateCard from "./TemplateCard";
import DialogBox from "./TemplateDialogBox";

type DialogManagerProps = {
  model: TemplateModel;
  isOpen: boolean;
  onClick: (modelName: string) => void;
  onClose: () => void;
};

const DialogManager = ({ model, isOpen, onClick, onClose }: DialogManagerProps) => {
  const handleCardClick = () => {
    onClick(model.name);
  };

  return (
    <>
      {isOpen ? (
        <DialogBox
          name={model.name}
          icon={model.icon}
          promptTemplate={model.promptTemplate}
          category={model.category}
          placeholder={model.placeholder}
          onClose={onClose}
        />
      ) : (
        <TemplateCard model={model} onClick={handleCardClick} />
      )}
    </>
  );
};

export default DialogManager;
