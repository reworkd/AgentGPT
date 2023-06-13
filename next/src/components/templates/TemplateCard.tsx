import FadeIn from "../motions/FadeIn";
import Expand from "../motions/expand";
import clsx from "clsx";
import { TemplateModel } from "./TemplateData";

type TemplateCardProps = {
    model: TemplateModel;
}

const TemplateCard = ({ model }: TemplateCardProps) => {
    return (                  
        <div
            className={clsx(
                "p-2 max-w-full sm:max-w-[350px] border-2 border-white/20 rounded-lg cursor-pointer text-white bg-zinc-900",
                "transition-colors hover:bg-zinc-800"
            )}
        >
            <div className={`h-full min-h-[100px]`}>
                <div className={`font-bold text-md mb-2`}>{model.name}</div>
                <div className={`text-xs text-gray-400 mb-1`}>Category: {model.category}</div>
                <div className={`text-sm`}>
                    {model.description}
                </div>
            </div>
        </div>
    )
}

export default TemplateCard;
