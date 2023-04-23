import React from "react";
import {
  FaListAlt,
  FaCheckCircle,
  FaCircleNotch,
  FaPlayCircle,
} from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import Expand from "./motions/expand";
import {
  Task,
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
} from "../types/agentTypes";
import { useMessageStore } from "../components/store";

export const TaskWindow = () => {
  const tasks = useMessageStore.use.tasks();
  return (
    <Expand className="xl mx-2 mt-4 hidden w-[20rem] flex-col items-center rounded-2xl border-2 border-white/20 bg-zinc-900 px-1 font-mono shadow-2xl xl:flex">
      <div className="sticky top-0 my-2 flex items-center justify-center gap-2 bg-zinc-900 p-2 text-gray-300 ">
        <FaListAlt /> Current tasks
      </div>
      <div className="window-heights mb-2 w-full px-1 ">
        <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {tasks.map((task, i) => (
            <Task key={i} task={task} />
          ))}
        </div>
      </div>
    </Expand>
  );
};

const Task = ({ task }: { task: Task }) => {
  const getTaskStatusIcon = (taskStatus: string) => {
    const taskStatusIconClass = "mr-1 mb-0.5 inline-block";
    switch (taskStatus) {
      case TASK_STATUS_STARTED:
        return (
          <FaCircleNotch className={`${taskStatusIconClass} animate-spin`} />
        );
        break;
      case TASK_STATUS_EXECUTING:
        return (
          <FaPlayCircle className={`${taskStatusIconClass} text-green-500`} />
        );

        break;
      case TASK_STATUS_COMPLETED:
        return (
          <FaCheckCircle
            className={`${taskStatusIconClass} text-green-500 hover:text-green-400`}
          />
        );
        break;
    }
  };

  const getTaskContainerStyle = (taskStatus: string) => {
    switch (taskStatus) {
      case TASK_STATUS_STARTED:
        return "border-dashed border-white/20 text-white";
        break;
      case TASK_STATUS_EXECUTING:
        return "border-white/20 text-white";
        break;
      case TASK_STATUS_COMPLETED:
        return "border-green-500 hover:border-green-400 hover:text-green-400 text-green-500";
        break;
      default:
        return "";
    }
  };

  return (
    <FadeIn>
      <div
        className={`w-full animate-[rotate] rounded-md border-2 p-2 text-sm  hover:border-white/40 ${getTaskContainerStyle(
          "completed"
        )}`}
      >
        {getTaskStatusIcon("completed")}
        <span>{task.value}</span>
      </div>
    </FadeIn>
  );
};
