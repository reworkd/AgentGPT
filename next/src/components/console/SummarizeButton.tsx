import clsx from "clsx";
import React from "react";

import { useAgentStore } from "../../stores";
import { useTaskStore } from "../../stores/taskStore";
import Button from "../Button";

const Summarize = () => {
  const agent = useAgentStore.use.agent();
  const lifecycle = useAgentStore.use.lifecycle();
  const tasksWithResults = useTaskStore.use
    .tasks()
    .filter((task) => task.status == "completed" && task.result !== "");
  const summarized = useAgentStore.use.summarized();
  const setSummarized = useAgentStore.use.setSummarized();

  if (!agent || lifecycle !== "stopped" || tasksWithResults.length < 1 || summarized) return null;

  return (
    <div
      className={clsx(
        "mr-2 flex flex-row items-center gap-2 rounded-lg bg-slate-1 p-2 shadow-depth-1 transition duration-300 sm:mr-4",
        "text-xs sm:text-base"
      )}
    >
      <span className="text-sm">Click here to summarize the conversation</span>
      <Button
        className="ml-auto py-1 font-medium sm:py-1 md:py-1"
        onClick={async () => {
          setSummarized(true);
          await agent?.summarize();
        }}
      >
        Summarize
      </Button>
    </div>
  );
};

export default Summarize;
