import type { WorkflowMeta } from "../../services/workflow/workflowApi";

type Props = {
  workflow: WorkflowMeta;
  onClick: () => void;
};

export default function WorkflowCard({ workflow, onClick }: Props) {
  return (
    <div
      key={workflow.id}
      className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-6"
      onClick={onClick}
    >
      <h1>{workflow.name}</h1>
      <h1>#{workflow.id}</h1>
      <p className="text-neutral-400">{workflow.description}</p>
    </div>
  );
}
