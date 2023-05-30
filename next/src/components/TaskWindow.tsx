import React from "react";
import FadeIn from "./motions/FadeIn";
import Expand from "./motions/expand";
import { MESSAGE_TYPE_TASK, Task, TASK_STATUS_STARTED } from "../types/agentTypes";
import { getMessageContainerStyle, getTaskStatusIcon } from "./utils/helpers";
import { useAgentStore, useMessageStore } from "../stores";
import { FaListAlt, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import Input from "./Input";
import Button from "./Button";
import { v1 } from "uuid";
import { AnimatePresence } from "framer-motion";

export interface TaskWindowProps {
  visibleOnMobile?: boolean;
}

export const TaskWindow = ({ visibleOnMobile }: TaskWindowProps) => {
  const [customTask, setCustomTask] = React.useState("");
  const agent = useAgentStore.use.agent();
  const tasks = useMessageStore.use.tasks();
  const addMessage = useMessageStore.use.addMessage();
  const [t] = useTranslation();

  const handleAddTask = () => {
    addMessage({
      id: v1().toString(),
      taskId: v1().toString(),
      value: customTask,
      status: TASK_STATUS_STARTED,
      type: MESSAGE_TYPE_TASK,
    });
    setCustomTask("");
  };

  return (
    <Expand
      className={clsx(
        "w-full flex-col items-center rounded-2xl border-2 border-white/20 bg-zinc-900 font-mono shadow-2xl xl:mx-2 xl:flex xl:w-[20rem] xl:px-1",
        !visibleOnMobile && "hidden"
      )}
    >
      <div className="sticky top-0 my-2 flex items-center justify-center gap-2 bg-zinc-900 p-2 text-gray-100 ">
        <FaListAlt /> {t("Current tasks")}
      </div>
      <div className="flex h-full w-full flex-col gap-2 px-1 py-1">
        <div className="window-heights flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden pr-1">
          {tasks.length == 0 && (
            <p className="w-full p-2 text-center text-xs text-gray-300">
              This window will display agent tasks as they are created.
            </p>
          )}
          <AnimatePresence>
            {tasks.map((task, i) => (
              <Task key={i} index={i} task={task} />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-row gap-1">
          <Input
            value={customTask}
            onChange={(e) => setCustomTask(e.target.value)}
            placeholder={"Custom task"}
            small
          />
          <Button
            className="font-sm px-2 py-[0] text-sm sm:px-2 sm:py-[0]"
            onClick={handleAddTask}
            disabled={!customTask || agent == null}
          >
            Add
          </Button>
        </div>
      </div>
    </Expand>
  );
};

const Task = ({ task, index }: { task: Task; index: number }) => {
  const isAgentStopped = useAgentStore.use.isAgentStopped();
  const deleteTask = useMessageStore.use.deleteTask();
  const isTaskDeletable = task.taskId && !isAgentStopped && task.status === "started";

  const handleDeleteTask = () => {
    if (isTaskDeletable) {
      deleteTask(task.taskId as string);
    }
  };

  return (
    <FadeIn>
      <div
        className={clsx(
          "w-full animate-[rotate] rounded-md border-2 p-2 text-xs text-white",
          isAgentStopped && "opacity-50",
          getMessageContainerStyle(task)
        )}
      >
        {getTaskStatusIcon(task, { isAgentStopped })}
        <span>{task.value}</span>
        <div className="flex justify-end">
          <FaTimesCircle
            onClick={handleDeleteTask}
            className={clsx(
              isTaskDeletable && "cursor-pointer hover:text-red-500",
              !isTaskDeletable && "cursor-not-allowed opacity-30"
            )}
            size={12}
          />
        </div>
      </div>
    </FadeIn>
  );
};
