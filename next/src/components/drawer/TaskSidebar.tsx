import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import React from "react";
import { FaBars, FaTimesCircle } from "react-icons/fa";
import { v1 } from "uuid";

import Sidebar from "./Sidebar";
import { useAgentStore } from "../../stores";
import { useConfigStore } from "../../stores/configStore";
import { useTaskStore } from "../../stores/taskStore";
import type { Task as TaskType } from "../../types/task";
import { MESSAGE_TYPE_TASK, TASK_STATUS_STARTED } from "../../types/task";
import Button from "../Button";
import Input from "../Input";
import FadeIn from "../motions/FadeIn";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";

const TaskSidebar = () => {
  const [customTask, setCustomTask] = React.useState("");
  const agent = useAgentStore.use.agent();
  const tasks = useTaskStore.use.tasks();
  const addTask = useTaskStore.use.addTask();
  const [t] = useTranslation();

  const { layout, setLayout } = useConfigStore();

  const setShow = (show: boolean) => {
    setLayout({ showRightSidebar: show });
  };

  const handleAddTask = () => {
    addTask({
      id: v1().toString(),
      taskId: v1().toString(),
      value: customTask,
      status: TASK_STATUS_STARTED,
      type: MESSAGE_TYPE_TASK,
    });
    setCustomTask("");
  };

  return (
    <Sidebar
      show={layout.showRightSidebar}
      setShow={setShow}
      side="right"
      className="border-slate-6s border-l"
    >
      <div className="flex h-screen flex-col gap-2 text-slate-12">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(!layout.showRightSidebar)}
          >
            <FaBars size="15" className="z-20 m-2" />
          </button>
          <div className="ml-5 font-bold">{t("Current tasks")}</div>
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-auto pr-1">
          {tasks.length == 0 && (
            <p className="w-full p-2 text-slate-11">
              This window will display agent tasks as they are created.
            </p>
          )}
          <AnimatePresence>
            {tasks.map((task) => (
              <Task key={`${task.id || ""} ${task.taskId || ""}`} task={task} />
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
    </Sidebar>
  );
};

const Task = ({ task }: { task: TaskType }) => {
  const isAgentStopped = useAgentStore.use.lifecycle() === "stopped";
  const deleteTask = useTaskStore.use.deleteTask();
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
          "w-full rounded-md bg-slate-1 p-2 text-sm text-slate-12 shadow-depth-1",
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
          />
        </div>
      </div>
    </FadeIn>
  );
};

export default TaskSidebar;
