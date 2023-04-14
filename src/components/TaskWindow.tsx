import React from "react";
import { FaListAlt } from "react-icons/fa";
import FadeIn from "./motions/FadeIn";
import Expand from "./motions/expand";

type TaskWindowProps = {
  tasks: string[];
};
export const TaskWindow = ({ tasks }: TaskWindowProps) => {
  return (
    <Expand className="xl m-3 hidden h-[65%] w-[20rem] flex-col items-center overflow-auto rounded-2xl border-2 border-white/30 bg-zinc-900 font-mono shadow-2xl xl:flex">
      <div className="w-full px-2">
        <div className="sticky top-0 my-2 flex items-center justify-center gap-2 bg-zinc-900 p-2 text-white">
          <FaListAlt /> Current tasks
        </div>
        <div className="flex flex-col gap-2">
          {tasks.map((task, index) => (
            <Task key={`${task}-${index}`} task={task} />
          ))}
        </div>
      </div>
    </Expand>
  );
};

const Task = ({ task }: { task: string }) => {
  return (
    <FadeIn delay={1}>
      <div className="w-full rounded-md border-2 border-white/20 p-2 text-sm text-white hover:border-white/40">
        {task}
      </div>
    </FadeIn>
  );
};
