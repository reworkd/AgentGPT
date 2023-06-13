import clsx from "clsx";
import type { TemplateModel } from "./TemplateData";

type TemplateCardProps = {
  model: TemplateModel;
};

const TemplateCard = ({ model }: TemplateCardProps) => {
  return (
    <div
      className={clsx(
        "max-w-full cursor-pointer rounded-lg border-2 border-white/20 bg-zinc-900 p-2 text-white sm:max-w-[350px]",
        "transition-colors hover:bg-zinc-800"
      )}
    >
      <div className={`h-full min-h-[100px]`}>
        <div className={`text-md mb-2 font-bold`}>{model.name}</div>
        <div className={`mb-1 text-xs text-gray-400`}>Category: {model.category}</div>
        <div className={`text-sm`}>{model.description}</div>
      </div>
    </div>
  );
};

export default TemplateCard;
