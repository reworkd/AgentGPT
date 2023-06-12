import FadeIn from "../motions/FadeIn";
import Expand from "../motions/expand";
import { TemplateModel } from "./TemplateData";
import clsx from "clsx";

type TemplateCardProps = {
    model: TemplateModel;
}

const TemplateCard = ({ model }: TemplateCardProps) => {
    return (                  
        <div
            className={clsx(
                "p-2 max-w-[350px] border-2 border-white/20 rounded-lg cursor-pointer text-white bg-zinc-900",
                "transition-colors hover:bg-zinc-800"
            )}
        >
            <div className={`h-full min-h-[100px]`}>
                <div className={`font-bold text-md mb-2`}>{model.value}</div>
                <div className={`text-sm`}>
                    {model.value}
                </div>
            </div>
        </div>
    )
}

export default TemplateCard;