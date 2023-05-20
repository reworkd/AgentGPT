import type { PropsWithChildren, ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { FaPause, FaPlay } from "react-icons/fa";
import PopIn from "../motions/popin";
import FadeIn from "../motions/FadeIn";
import type { AgentStatus, Message } from "../../types/agentTypes";
import {
  AUTOMATIC_MODE,
  getTaskStatus,
  isAction,
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_SYSTEM,
  MESSAGE_TYPE_THINKING,
  PAUSE_MODE,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/agentTypes";
import clsx from "clsx";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";
import MarkdownRenderer from "./MarkdownRenderer";
import { MacWindowHeader } from "./MacWindowHeader";
import type { HeaderProps } from "../../utils/types";
import { messageListId } from "../../utils/constants";
import { TaskWindow, TaskWindowContent } from "../TaskWindow";
import FadingHr from "../FadingHr";
import { useAgent } from "../../hooks/useAgent";

interface ChatWindowProps extends PropsWithChildren<HeaderProps> {
  className?: string;
  fullscreen?: boolean;
  scrollToBottom?: boolean;
  displaySettings?: boolean; // Controls if settings are displayed at the bottom of the ChatWindow
  openSorryDialog?: () => void;
  setAgentRun?: (name: string, goal: string) => void;
  visibleOnMobile?: boolean;
}

const ChatWindow = ({
  messages,
  children,
  className,
  title,
  onSave,
  fullscreen,
  scrollToBottom,
  displaySettings,
  openSorryDialog,
  setAgentRun,
  visibleOnMobile,
}: ChatWindowProps) => {
  const [t] = useTranslation();
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { agent, status, runningMode } = useAgent();

  const [activeTab, setActiveTab] = useState<"chat" | "tasks">("chat");

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    // Use has scrolled if we have scrolled up at all from the bottom
    const hasUserScrolled = scrollTop < scrollHeight - clientHeight - 10;
    setHasUserScrolled(hasUserScrolled);
  };

  useEffect(() => {
    // Scroll to bottom on re-renders
    if (scrollToBottom && scrollRef && scrollRef.current) {
      if (!hasUserScrolled) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  });

  const pauseAnimation = agent && runningMode === PAUSE_MODE && status === "paused" && (
    <FaPause
      className="animation-hide absolute left-1/2 top-1/2 -translate-x-1/2 text-lg"
      size="50"
    />
  );

  const chatTab = (
    <>
      {pauseAnimation}
      {messages.map((message, index) => {
        if (getTaskStatus(message) === TASK_STATUS_EXECUTING) {
          return null;
        }

        return (
          <FadeIn key={`${index}-${message.type}`}>
            <ChatMessage message={message} status={status} />
          </FadeIn>
        );
      })}
      {children}

      {messages.length === 0 && (
        <>
          <PopIn delay={0.8}>
            <ChatMessage
              message={{
                type: MESSAGE_TYPE_SYSTEM,
                value: "👉 " + t("CREATE_AN_AGENT_DESCRIPTION", { ns: "chat" }),
              }}
            />
          </PopIn>
          <PopIn delay={1.5} className="flex flex-col justify-between gap-2 sm:flex-row">
            <ExampleAgentButton name="PlatformerGPT 🎮" setAgentRun={setAgentRun}>
              Write some code to make a platformer game.
            </ExampleAgentButton>
            <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
              Plan a detailed trip to Hawaii.
            </ExampleAgentButton>
            <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
              Create a comprehensive report of the Nike company
            </ExampleAgentButton>
          </PopIn>
        </>
      )}
    </>
  );

  const taskTab = <TaskWindowContent />;

  return (
    <div
      className={clsx(
        "border-translucent z-10 w-full flex-col rounded-2xl border-2 border-white/20 bg-zinc-900 pb-2 text-white shadow-2xl drop-shadow-lg xl:flex",
        className,
        visibleOnMobile ? "flex" : "hidden"
      )}
    >
      <MacWindowHeader
        title={title}
        messages={messages}
        onSave={onSave}
        tabs={[
          {
            title: "Chat",
            isActive: activeTab == "chat",
            onCLick: () => {
              setActiveTab("chat");
            },
          },
          {
            title: "Tasks",
            isActive: activeTab == "tasks",
            onCLick: () => {
              setActiveTab("tasks");
            },
          },
        ]}
      />
      <div
        className={clsx(
          "flex flex-col gap-2 rounded-2xl px-2",
          fullscreen && "max-h-[75vh] flex-grow overflow-auto",
          fullscreen || "window-heights"
        )}
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {activeTab == "chat" && chatTab}
        {activeTab == "tasks" && taskTab}
      </div>
    </div>
  );
};

const ExampleAgentButton = ({
  name,
  children,
  setAgentRun,
}: {
  name: string;
  children: string;
  setAgentRun?: (name: string, goal: string) => void;
}) => {
  const handleClick = () => {
    if (setAgentRun) {
      setAgentRun(name, children);
    }
  };

  return (
    <div
      className={clsx(
        `w-full p-2 sm:w-[33%]`,
        `cursor-pointer rounded-lg bg-sky-600 font-mono text-sm hover:bg-sky-700 sm:text-base`,
        `border-[2px] border-white/20 hover:border-[#1E88E5]/40`
      )}
      onClick={handleClick}
    >
      <p className="text-lg font-black">{name}</p>
      {children}
    </div>
  );
};

const ChatMessage = ({ message, status }: { message: Message; status?: AgentStatus }) => {
  const [t] = useTranslation();

  return (
    <div
      className={clsx(
        getMessageContainerStyle(message),
        "rounded-lg border-[1px] bg-white/20 p-2 font-mono text-xs hover:border-[#1E88E5]/40 sm:text-sm"
      )}
    >
      {message.type != MESSAGE_TYPE_SYSTEM && (
        // Avoid for system messages as they do not have an icon and will cause a weird space
        <>
          <div className="mr-2 inline-block h-[0.9em]">{getTaskStatusIcon(message, status)}</div>
          <span className="mr-2 font-bold">{t(getMessagePrefix(message), { ns: "chat" })}</span>
        </>
      )}

      {message.type == MESSAGE_TYPE_THINKING && (
        <span className="italic text-zinc-400">
          {`${t("RESTART_IF_IT_TAKES_X_SEC", {
            ns: "chat",
          })}`}
        </span>
      )}

      {isAction(message) ? (
        <>
          <FadingHr className="my-2" />
          <div className="prose">
            <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
          </div>
        </>
      ) : (
        <>
          <span>{t(message.value, { ns: "chat" })}</span>
          {
            // Link to the FAQ if it is a shutdown message
            message.type == MESSAGE_TYPE_SYSTEM &&
              (message.value.toLowerCase().includes("shut") ||
                message.value.toLowerCase().includes("error")) && <FAQ />
          }
        </>
      )}
    </div>
  );
};

// Returns the translation key of the prefix
const getMessagePrefix = (message: Message) => {
  if (message.type === MESSAGE_TYPE_GOAL) {
    return "EMBARKING_ON_NEW_GOAL";
  } else if (message.type === MESSAGE_TYPE_THINKING) {
    return "THINKING";
  } else if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return "TASK_ADDED";
  } else if (getTaskStatus(message) === TASK_STATUS_COMPLETED) {
    return `Completing: ${message.value}`;
  } else if (getTaskStatus(message) === TASK_STATUS_FINAL) {
    return "NO_MORE_TASKS";
  }
  return "";
};

const FAQ = () => {
  return (
    <p>
      <br />
      If you are facing issues, please head over to our{" "}
      <a href="https://docs.reworkd.ai/faq" className="text-sky-500">
        FAQ
      </a>
    </p>
  );
};
export default ChatWindow;
export { ChatMessage };
