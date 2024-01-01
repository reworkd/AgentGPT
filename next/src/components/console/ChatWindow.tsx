import clsx from "clsx";
import { useTranslation } from "next-i18next";
import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowCircleDown, FaCommentDots } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

import type { HeaderProps } from "./MacWindowHeader";
import { MacWindowHeader, messageListId } from "./MacWindowHeader";
import { useAgentStore } from "../../stores";
import Button from "../Button";
import Input from "../Input";
import HideShow from "../motions/HideShow";

interface ChatControls {
  value: string;
  onChange: (string) => void;
  handleChat: () => Promise<void>;
  loading?: boolean;
}

interface ChatWindowProps extends HeaderProps {
  children?: ReactNode;
  setAgentRun?: (name: string, goal: string) => void;
  visibleOnMobile?: boolean;
  chatControls?: ChatControls;
}

const ChatWindow = ({ messages, children, title, chatControls }: ChatWindowProps) => {
  const [t] = useTranslation();
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const isThinking = useAgentStore.use.isAgentThinking();
  const isStopped = useAgentStore.use.lifecycle() === "stopped";
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    // Use has scrolled if we have scrolled up at all from the bottom
    const hasUserScrolled = scrollTop < scrollHeight - clientHeight - 10;
    setHasUserScrolled(hasUserScrolled);
  };

  const handleScrollToBottom = (behaviour: "instant" | "smooth") => {
    if (!scrollRef || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: behaviour,
    });
  };

  useEffect(() => {
    if (!hasUserScrolled) {
      handleScrollToBottom("instant");
    }
  });

  return (
    <div
      className={clsx(
        "flex h-full w-full max-w-[inherit] flex-1 flex-col overflow-auto text-slate-12 transition-all duration-500"
      )}
    >
      <HideShow
        showComponent={hasUserScrolled}
        className="absolute bottom-11 right-6 z-40 cursor-pointer sm:bottom-14"
      >
        <FaArrowCircleDown
          onClick={() => handleScrollToBottom("smooth")}
          className="h-6 w-6 animate-bounce md:h-7 md:w-7"
        />
      </HideShow>
      <MacWindowHeader title={title} messages={messages} />
      <div
        className="mb-2 mr-2 flex-1 overflow-auto transition-all duration-500"
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {children}
        <div
          className={clsx(
            isThinking && !isStopped ? "opacity-100" : "opacity-0",
            "mr-2 flex flex-row items-center gap-2 p-2 transition duration-300 sm:mr-4",
            "text-xs sm:text-base"
          )}
        >
          <p>🧠 Thinking</p>
          <ImSpinner2 className="animate-spin" />
        </div>
      </div>
      {chatControls && (
        <div className="mt-auto flex flex-row gap-2 p-2 pt-0 sm:p-4">
          <Input
            small
            placeholder="Chat with your agent..."
            value={chatControls.value}
            onChange={(e) => chatControls?.onChange(e.target.value)}
          />
          <Button
            className="px-1 py-1 sm:px-3 md:py-1"
            onClick={chatControls?.handleChat}
            disabled={chatControls.loading}
          >
            <FaCommentDots />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
