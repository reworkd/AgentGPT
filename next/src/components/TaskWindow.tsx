import React from "react";
import FadeIn from "./motions/FadeIn";
import Expand from "./motions/expand";
import { getMessageContainerStyle, getTaskStatusIcon } from "./utils/helpers";
import { useAgentStore } from "../stores";
import { FaListAlt, FaTimesCircle } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";

import { useTranslation } from "next-i18next";
import clsx from "clsx";
import Input from "./Input";
import Button from "./Button";
import { v1 } from "uuid";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { MESSAGE_TYPE_TASK, Task, TASK_STATUS_STARTED } from "../types/task";
import { useTaskStore } from "../stores/taskStore";

export interface TaskWindowProps {
  visibleOnMobile?: boolean;
}

export const TaskWindow = ({ visibleOnMobile }: TaskWindowProps) => {
  const [customTask, setCustomTask] = React.useState("");
  const agent = useAgentStore.use.agent();
  const tasks = useTaskStore.use.tasks();
  const setTasks = useTaskStore.use.setTasks();
  const addTask = useTaskStore.use.addTask();
  const [t] = useTranslation();

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



  // For storing Index of the task which we want to drag
  const dragTaskIndex = React.useRef(null);
  // When Task DragStarted
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, i: number) => {
    dragTaskIndex.current = i;

    // Making Task opacity zero in the task list. Using timeout because without it, it will make opacity 0 instantly and then the Task which is showing on cursor will also not visible
    setTimeout(() => {
      e.target.classList.add("opacity-0");
    }, 0);
  }
  // When we drag the task upon another task
  const onDragEnter = (i: number) => {
    if (dragTaskIndex.current === null) return;
    // Tasks Order will be updated only when the Task on which we are droping has `started` status 
    if (tasks[i].status !== "started") return
    const _items = [...tasks];
    // removing the Task from array
    const draggedItem = _items.splice(dragTaskIndex.current, 1)[0];
    // inserting that element in new position where we want to drop
    _items.splice(i, 0, draggedItem);
    dragTaskIndex.current = i;
    setTasks(_items)
  }

  // When we left the draging Task
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    dragTaskIndex.current = null;
    e.target.classList.remove("opacity-0");
  }

  return (
    <Expand
      className={clsx(
        "h-full flex-col items-center rounded-2xl border-2 border-white/20 bg-zinc-900 font-mono shadow-2xl",
        "w-full xl:ml-2 xl:flex xl:w-64 xl:px-1",
        !visibleOnMobile && "hidden"
      )}
    >
      <div className="sticky top-0 my-1 flex items-center justify-center gap-2 bg-zinc-900 p-2 text-gray-100 ">
        <FaListAlt /> {t("Current tasks")}
      </div>
      <div className="flex h-full w-full flex-col gap-1 overflow-auto p-1">
        <div className="flex h-full w-full flex-col gap-2 overflow-auto pr-1">
          {tasks.length == 0 && (
            <p className="w-full p-2 text-center text-xs text-gray-300">
              This window will display agent tasks as they are created.
            </p>
          )}
          <Reorder.Group drag="y" values={[]} onReorder={() => { }} as="div" >
            <AnimatePresence>
              {tasks.map((task, i) => (
                <Reorder.Item
                  key={task.id}
                  as='span'
                  className="mb-2"
                  >
                  <Task index={i} task={task}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragEnd={onDragEnd}
                  />
                </Reorder.Item>
              )
              )
              }
            </AnimatePresence>
          </Reorder.Group>
        </div>
        <div className="mt-auto flex flex-row gap-1">
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


interface TaskPropsInterface {
  task: Task; index: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, i: number) => void;
  onDragEnter: (i: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Task = ({ task, index, onDragStart, onDragEnter, onDragEnd }: TaskPropsInterface) => {
  const isAgentStopped = useAgentStore.use.lifecycle() === "stopped";
  const deleteTask = useTaskStore.use.deleteTask();
  const isTaskDeletable = task.taskId && !isAgentStopped && task.status === "started";

  const handleDeleteTask = () => {
    if (isTaskDeletable) {
      deleteTask(task.taskId as string);
    }
  };

  return (
    <div
      className={` mb-1`}
      draggable={task.status === "started"}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
      >
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
          {task.status === "started" &&
            <RxDragHandleDots2
            size={12}
            className={"cursor-move mr-auto"}
            />
          }
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
    </div>
  );
};
