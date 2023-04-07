import cx from "classnames";
import type { ReactNode } from "react";
import type { Message } from "../pages";
import React from "react";

interface ChatWindowProps {
  children?: ReactNode;
}

const ChatWindow = ({ children }: ChatWindowProps) => {
  return (
    <div className="border-translucent flex h-80 w-full max-w-screen-md flex-col rounded-3xl bg-black/50 text-white drop-shadow-lg">
      <MacWindowHeader />
      <div className="overflow-y-scroll">{children}</div>
    </div>
  );
};

const MacWindowHeader = () => {
  return (
    <div
      className={cx("flex gap-1 rounded-t-3xl p-3", "flex gap-1 rounded-t-3xl")}
    >
      <div className="h-3 w-3 rounded-full bg-red-500"></div>
      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
    </div>
  );
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className="mx-4 my-1 rounded-lg border-[1px] border-transparent bg-white/20 p-3 font-mono hover:border-[#1E88E5]">
      <span>
        {message.type === "goal" ? "🌟 Embarking on a new goal: " : ""}
        {message.type === "task" ? "📝 Adding to task list: " : ""}
      </span>
      <span className="font-black">{message.value}</span>
    </div>
  );
};

export default ChatWindow;
export { ChatMessage };
