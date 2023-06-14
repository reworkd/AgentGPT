import clsx from "clsx";
import type { TemplateModel } from "./TemplateData";

type TemplateCardProps = {
  model: TemplateModel;
};

const TemplateCard = ({ model }: TemplateCardProps) => {
  return (
    <div
      className={clsx(
        "h-34 w-72 max-w-sm space-y-2 whitespace-normal rounded-2xl border border-white/20 p-4 text-left transition-all duration-100 ",
        "bg-zinc-900 transition-colors hover:bg-zinc-800"
      )}
    >
      <div className="flex items-center">
        <div className="mr-2 text-xl text-white">{model.icon}</div>
        <div className={`text-md mb-0 font-bold text-white`}>{model.name}</div>
      </div>
      <div className={clsx(`mb-2 inline-block rounded-full px-0 text-xs text-gray-400`)}>
        {model.category}
      </div>
      <div className={`text-sm text-gray-200 `}>{model.description}</div>
    </div>
  );
};

export default TemplateCard;
