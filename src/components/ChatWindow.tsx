import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { FaBrain, FaListAlt, FaPlayCircle, FaStar } from "react-icons/fa";
import autoAnimate from "@formkit/auto-animate";
import PopIn from "./motions/popin";

interface ChatWindowProps {
  children?: ReactNode;
  className?: string;
  messages: Message[];
}

const ChatWindow = ({ messages, children, className }: ChatWindowProps) => {
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    // Use has scrolled if we have scrolled up at all from the bottom
    if (scrollTop < scrollHeight - clientHeight - 10) {
      setHasUserScrolled(true);
    } else {
      setHasUserScrolled(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom on re-renders
    if (scrollRef && scrollRef.current) {
      if (!hasUserScrolled) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
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
        className="mb-2 mr-2 h-[11em] overflow-y-auto overflow-x-hidden sm-h:h-[16em] md-h:h-[21em] lg-h:h-[30em] "
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {messages.map((message, index) => (
          <ChatMessage key={`${index}-${message.type}`} message={message} />
        ))}
        {children}

        {messages.length === 0 ? (
          <PopIn delay={1}>
            <ChatMessage
              message={{
                type: "system",
                value:
                  "> Create an agent by adding a name / goal, and hitting deploy!",
              }}
            />
          </PopIn>
        ) : (
          ""
        )}
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
    <div className="mx-2 my-1 rounded-lg border-[2px] border-white/10 bg-white/20 p-2 font-mono text-sm hover:border-[#1E88E5]/40 sm:mx-4 sm:p-3 sm:text-base">
      <div className="mr-2 inline-block h-[0.9em]">
        {getMessageIcon(message)}
      </div>
      <span className="mr-2 font-bold">{getMessagePrefix(message)}</span>
      {message.type == "thinking" && (
        <span className="italic text-zinc-400">
          (Restart if this takes more than 30 seconds)
        </span>
      )}
      <span>{message.value}</span>
    </div>
  );
};

const getMessageIcon = (message: Message) => {
  switch (message.type) {
    case "goal":
      return <FaStar className="text-yellow-400" />;
    case "task":
      return <FaListAlt className="text-gray-300" />;
    case "thinking":
      return <FaBrain className="mt-[0.1em] text-pink-400" />;
    case "action":
      return <FaPlayCircle className="text-green-500" />;
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
      return message.info ? message.info : "Executing:";
  }
};

export interface Message {
  type: "goal" | "thinking" | "task" | "action" | "system";
  info?: string;
  value: string;
}

export default ChatWindow;
export { ChatMessage };
