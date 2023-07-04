import clsx from "clsx";
import type { TemplateModel } from "./TemplateData";
import { useRouter } from "next/router";
import { useAgentInputStore } from "../../stores/agentInputStore";

type TemplateCardProps = {
  model: TemplateModel;
};

const TemplateCard = ({ model }: TemplateCardProps) => {
  const router = useRouter();
  const setNameInput = useAgentInputStore.use.setNameInput();
  const setGoalInput = useAgentInputStore.use.setGoalInput();

  const handleClick = () => {
    setNameInput(model.name);
    setGoalInput(model.promptTemplate);
    router.push("/").catch(console.log);
  };
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "h-34 w-full max-w-lg cursor-pointer space-y-2 whitespace-normal rounded-2xl border border-white/20 p-4 text-left transition-all duration-100",
        "background-color-6 transition-colors hover:bg-blue-hover-light dark:hover:bg-shade-700-dark"
      )}
    >
      <div className="flex items-center">
        <div className="mr-2 text-xl text-white">{model.icon}</div>
        <div className={`text-md mb-0 font-bold text-white`}>{model.name}</div>
      </div>
      <div
        className={clsx(
          `mb-2  inline-block rounded-full  text-xs text-shade-800-light dark:text-shade-300-dark`
        )}
      >
        {model.category}
      </div>
      <div className={`text-sm text-shade-700-light dark:text-shade-200-dark `}>
        {model.description}
      </div>
    </div>
  );
};

export default TemplateCard;
