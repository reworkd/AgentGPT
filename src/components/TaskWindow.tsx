import React from "react";
import FadeIn from "./motions/FadeIn";
import Expand from "./motions/expand";
import { Task } from "../types/agentTypes";
import { getMessageContainerStyle, getTaskStatusIcon } from "./utils/helpers";
import { useMessageStore } from "./stores";
import { FaListAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAgentStore } from "./stores";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";

export const TaskWindow = () => {
  const tasks = useMessageStore.use.tasks();
  const reorderTasks = useMessageStore.use.reorderTasks();
  const [t] = useTranslation();

  function onDragEnd(result) {
    console.log("source: " + result.source.index);
    console.log("destination: " + result.destination.index);
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    reorderTasks(result.source.index, result.destination.index);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <Expand className="xl mx-2 mt-4 hidden w-[20rem] flex-col items-center rounded-2xl border-2 border-white/20 bg-zinc-900 px-1 font-mono shadow-2xl xl:flex">
            <div className="sticky top-0 my-2 flex items-center justify-center gap-2 bg-zinc-900 p-2 text-gray-300 ">
              <FaListAlt /> {t("Current tasks")}
            </div>
            <div className="window-heights mb-2 w-full px-1">
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
              >
                {tasks.map((task, i) => (
                  <Task key={task.taskId} index={i} task={task} />
                ))}
              </div>
            </div>
            {provided.placeholder}
          </Expand>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const Task = ({ task, index }: { task: Task; index: number }) => {
  const isAgentStopped = useAgentStore.use.isAgentStopped();
  return (
    <Draggable draggableId={task.taskId!} index={index}>
      {(provided) => (
        <FadeIn>
          <div
            className="bg-zinc-900"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={clsx(
                "w-full animate-[rotate] rounded-md border-2 p-2 text-xs text-white",
                isAgentStopped && "opacity-50",
                getMessageContainerStyle(task)
              )}
            >
              {getTaskStatusIcon(task, { isAgentStopped })}
              <span>{task.value}</span>
            </div>
          </div>
        </FadeIn>
      )}
    </Draggable>
  );
};
