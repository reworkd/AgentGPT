import cx from "classnames";
import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";

interface ChatWindowProps {
  children?: ReactNode;
  className: string;
  messages: Message[];
}

const ChatWindow = ({ messages, children, className }: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on re-renders
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  return (
    <div
      className={
        "border-translucent flex w-full flex-col rounded-3xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg " +
        className
      }
    >
      <MacWindowHeader />
      <div
        className="mb-3 mr-3 overflow-y-auto sm:h-[10em] 2xl:h-[20em]"
        ref={scrollRef}
      >
        {messages.map((message, index) => (
          <ChatMessage key={`${index}-${message.type}`} message={message} />
        ))}
        {children}
      </div>
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
        {message.type === "task" ? "📝 Adding task: " : ""}
      </span>
      <span className="font-black">{message.value}</span>
    </div>
  );
};

export interface Message {
  type: "goal" | "thinking" | "task" | "action";
  value: string;
}

export const CreateGoalMessage = (goal: string): Message => {
  return { type: "goal", value: goal };
};

export const CreateTaskMessage = (task: string): Message => {
  return { type: "task", value: task };
};

export default ChatWindow;
export { ChatMessage };
