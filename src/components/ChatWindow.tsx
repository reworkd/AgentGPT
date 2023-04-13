import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  FaBrain,
  FaClipboard,
  FaListAlt,
  FaPlayCircle,
  FaSave,
  FaStar,
  FaCopy,
} from "react-icons/fa";
import autoAnimate from "@formkit/auto-animate";
import PopIn from "./motions/popin";
import Expand from "./motions/expand";
import * as htmlToImage from "html-to-image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface ChatWindowProps {
  children?: ReactNode;
  className?: string;
  messages: Message[];
}

const messageListId = "chat-window-message-list";

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
        className="mb-2 mr-2 h-[14em] overflow-y-auto overflow-x-hidden sm-h:h-[17em] md-h:h-[22em] lg-h:h-[30em] "
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {messages.map((message, index) => (
          <ChatMessage key={`${index}-${message.type}`} message={message} />
        ))}
        {children}

        {messages.length === 0 ? (
          <Expand delay={0.8} type="spring">
            <ChatMessage
              message={{
                type: "system",
                value:
                  "> Create an agent by adding a name / goal, and hitting deploy!",
              }}
            />
            <ChatMessage
              message={{
                type: "system",
                value:
                  "📢 Please first provide your own OpenAI API key via the settings tab!",
              }}
            />
          </Expand>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const MacWindowHeader = () => {
  const saveElementAsImage = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    htmlToImage
      .toJpeg(element, {
        height: element.scrollHeight,
        style: {
          overflowY: "visible",
          maxHeight: "none",
          border: "none",
        },
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "agent-gpt-output.png";
        link.click();
      })
      .catch(console.error);
  };

  const copyElementText = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    const text = element.innerText;
    navigator.clipboard.writeText(text).then(
      () => {
        console.info("Copied text to clipboard");
      },
      () => {
        console.error("Failed to copy text to clipboard");
      }
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-t-3xl p-3">
      <PopIn delay={0.4}>
        <div className="h-3 w-3 rounded-full bg-red-500" />
      </PopIn>
      <PopIn delay={0.5}>
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
      </PopIn>
      <PopIn delay={0.6} className="flex-grow">
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </PopIn>

      <div
        className="mr-1 flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 p-1 px-2 hover:bg-white/10"
        onClick={(): void => saveElementAsImage(messageListId)}
      >
        <FaSave size={12} />
        <p className="font-mono">Save</p>
      </div>
      <div
        className="mr-1 flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 p-1 px-2 hover:bg-white/10"
        onClick={(): void => copyElementText(messageListId)}
      >
        <FaClipboard size={12} />
        <p className="font-mono">Copy</p>
      </div>
    </div>
  );
};
const ChatMessage = ({ message }: { message: Message }) => {
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    void navigator.clipboard.writeText(message.value);
    setCopied(true);
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [copied]);
  return (
    <div
      className="mx-2 my-1 rounded-lg border-[2px] border-white/10 bg-white/20 p-1 font-mono text-sm hover:border-[#1E88E5]/40 sm:mx-4 sm:p-3 sm:text-base"
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
      onClick={handleCopyClick}
    >
      {message.type != "system" && (
        // Avoid for system messages as they do not have an icon and will cause a weird space
        <>
          <div className="mr-2 inline-block h-[0.9em]">
            {getMessageIcon(message)}
          </div>
          <span className="mr-2 font-bold">{getMessagePrefix(message)}</span>
        </>
      )}

      {message.type == "thinking" && (
        <span className="italic text-zinc-400">
          (Restart if this takes more than 30 seconds)
        </span>
      )}
      <div className="prose ml-2 max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {message.value}
        </ReactMarkdown>
      </div>

      <div className="relative">
        {copied ? (
          <span className="absolute bottom-0 right-0 rounded-full border-2 border-white/30 bg-zinc-800 p-1 px-2 text-gray-300">
            Copied!
          </span>
        ) : (
          <span
            className={`absolute bottom-0 right-0 rounded-full border-2 border-white/30 bg-zinc-800 p-1 px-2 ${
              showCopy ? "visible" : "hidden"
            }`}
          >
            <FaCopy className="text-white-300 cursor-pointer" />
          </span>
        )}
      </div>
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
