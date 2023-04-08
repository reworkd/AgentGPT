import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";
import { FaBrain, FaListAlt, FaPlayCircle, FaStar } from "react-icons/fa";
import autoAnimate from "@formkit/auto-animate";

interface ChatWindowProps {
  children?: ReactNode;
  className?: string;
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

  useEffect(() => {
    scrollRef.current && autoAnimate(scrollRef.current);
  }, [messages]);

  return (
    <div
      className={
        "border-translucent flex w-full flex-col rounded-3xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg " +
        (className ?? "")
      }
    >
      <MacWindowHeader />
      <div
        className="mb-3 mr-3 h-[10em] overflow-y-auto 2xl:h-[20em] "
        ref={scrollRef}
      >
        {messages.map((message, index) => (
          <ChatMessage key={`${index}-${message.type}`} message={message} />
        ))}
        {children}

        <ChatMessage message={{ type: "thinking", value: "" }} />
      </div>
    </div>
  );
};

const MacWindowHeader = () => {
  return (
    <div className="flex gap-1 rounded-t-3xl p-3">
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <div className="h-3 w-3 rounded-full bg-yellow-500" />
      <div className="h-3 w-3 rounded-full bg-green-500" />
    </div>
  );
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className="mx-4 my-1 rounded-lg border-[2px] border-white/10 bg-white/20 p-3 font-mono hover:border-[#1E88E5]">
      <div className="mr-2 inline-block h-[0.9em]">
        {getMessageIcon(message)}
      </div>
      <span className="mr-2 font-bold">{getMessagePrefix(message)}</span>
      <span>{message.value}</span>
    </div>
  );
};

const getMessageIcon = (message: Message) => {
  switch (message.type) {
    case "goal":
      return <FaStar />;
    case "task":
      return <FaListAlt />;
    case "thinking":
      return <FaBrain className="mt-[0.1em]" />;
    case "action":
      return <FaPlayCircle />;
  }
};

const getMessagePrefix = (message: Message) => {
  switch (message.type) {
    case "goal":
      return "Embarking on a new goal:";
    case "task":
      return "Added task:";
    case "thinking":
      return "Thinking...";
    case "action":
      return "Executing action:";
  }
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
