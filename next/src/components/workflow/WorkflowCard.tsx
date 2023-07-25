import { motion } from "framer-motion";

import type { WorkflowMeta } from "../../services/workflow/workflowApi";
import Input from "../../ui/input";
import PrimaryButton from "../PrimaryButton";
import TextButton from "../TextButton";

type Props = {
  workflow: WorkflowMeta;
  onClick: () => void;
};

export default function WorkflowCard({ workflow, onClick }: Props) {
  return (
    <motion.div
      layoutId={`workflow-card-${workflow.id}`}
      className="background-color-1 hover:background-color-2 border-color-1 hover:border-color-2 flex cursor-pointer flex-col gap-3 rounded-md border p-6 transition-colors duration-300"
      onClick={onClick}
    >
      <motion.div layoutId={`workflow-card-text-${workflow.id}`}>
        <h1 className="text-color-primary font-bold">{workflow.name}</h1>
        <p className="text-color-secondary text-sm">{workflow.description}</p>
        {workflow.organization_id && (
          <p className="text-color-secondary">Org: {workflow.organization_id}</p>
        )}
      </motion.div>

      <motion.div layoutId={`workflow-card-input-${workflow.id}`} />
      <motion.div layoutId={`workflow-card-buttons-${workflow.id}`} />
    </motion.div>
  );
}

type WorkflowCardDialogProps = {
  workflow: WorkflowMeta;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

// Note, this is currently not being used.
export function WorkflowCardDialog({
  workflow,
  onEdit,
  onDelete,
  onClose,
}: WorkflowCardDialogProps) {
  return (
    <>
      <motion.div key="modal" onClick={onClose}>
        <motion.div className="relative left-0 top-0 z-20 grid h-full w-full place-items-center">
          <motion.div
            layoutId={`workflow-card-${workflow.id}`}
            className="background-color-1 border-color-1 flex w-72 flex-col gap-3 rounded-2xl border p-6"
          >
            <motion.div layoutId={`workflow-card-text-${workflow.id}`}>
              <h1 className="text-color-primary font-bold">{workflow.name}</h1>
              <p className="text-color-secondary">{workflow.description}</p>
            </motion.div>

            <motion.div
              layoutId={`workflow-card-input-${workflow.id}`}
              className={"flex flex-col gap-2"}
            >
              <Input label={"Workflow name"} name={workflow.name} value={workflow.name} />
              <Input
                label={"Workflow description"}
                name={workflow.description}
                value={workflow.description}
              />
            </motion.div>

            <motion.div layoutId={`workflow-card-buttons-${workflow.id}`} className="ml-auto">
              <TextButton onClick={onClose}>Close</TextButton>
              <TextButton onClick={onDelete}>Delete</TextButton>
              <PrimaryButton onClick={onEdit}>Edit</PrimaryButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed left-0 top-0 z-10 h-full w-full bg-black"
        key="backdrop"
        onClick={onClose}
        variants={{
          hidden: {
            opacity: 0,
            transition: {
              duration: 0.16,
            },
          },
          visible: {
            opacity: 0.8,
            transition: {
              delay: 0.04,
              duration: 0.2,
            },
          },
        }}
        initial="hidden"
        exit="hidden"
        animate="visible"
      />
    </>
  );
}
