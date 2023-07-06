import { useAgentStore } from "../../stores";
import { useTaskStore } from "../../stores/taskStore";
import React from "react";
import clsx from "clsx";
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
        "mx-2 flex flex-row items-center gap-2 rounded-lg border border-white/20 p-2 font-mono transition duration-300 sm:mx-4",
        "text-xs sm:text-base"
      )}
    >
      <span className="md:hidden">Test</span>
      <span className="hidden md:inline">Click here to summarize the conversation!</span>
      <Button
        className="ml-auto py-1  sm:py-1  md:py-1"
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
