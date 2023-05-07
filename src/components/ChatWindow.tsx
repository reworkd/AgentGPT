import type { ForwardedRef, ReactNode } from "react";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  FaClipboard,
  FaImage,
  FaSave,
  FaPlay,
  FaPause,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import PopIn from "./motions/popin";
import Expand from "./motions/expand";
import * as htmlToImage from "html-to-image";
import WindowButton from "./WindowButton";
import IconButton from "./IconButton";
import PDFButton from "./pdf/PDFButton";
import FadeIn from "./motions/FadeIn";
import Menu from "./Menu";
import type { Message } from "../types/agentTypes";
import {
  isAction,
  getTaskStatus,
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_THINKING,
  MESSAGE_TYPE_SYSTEM,
  TASK_STATUS_STARTED,
  TASK_STATUS_EXECUTING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  PAUSE_MODE,
  isTask,
} from "../types/agentTypes";
import clsx from "clsx";
import { getMessageContainerStyle, getTaskStatusIcon } from "./utils/helpers";
import type { Translation } from "../utils/types";
import { useAgentStore, useMessageStore } from "../components/stores";
import { AnimatePresence } from "framer-motion";
import { CgExport } from "react-icons/cg";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatWindowProps extends HeaderProps {
  children?: ReactNode;
  className?: string;
  fullscreen?: boolean;
  scrollToBottom?: boolean;
}

const messageListId = "chat-window-message-list";

const ChatWindow = ({
  messages,
  children,
  className,
  title,
  onSave,
  fullscreen,
  scrollToBottom,
}: ChatWindowProps) => {
  const [t] = useTranslation();
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAgentPaused = useAgentStore.use.isAgentPaused();
  const agentMode = useAgentStore.use.agentMode();
  const agent = useAgentStore.use.agent();

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

  return (
    <div
      className={
        "border-translucent flex w-full flex-col rounded-2xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg " +
        (className ?? "")
      }
    >
      <MacWindowHeader title={title} messages={messages} onSave={onSave} />
      <div
        className={clsx(
          "mb-2 mr-2 ",
          (fullscreen && "max-h-[75vh] flex-grow overflow-auto") ||
            "window-heights"
        )}
        ref={scrollRef}
        onScroll={handleScroll}
        id={messageListId}
      >
        {agent !== null && agentMode === PAUSE_MODE && isAgentPaused && (
          <FaPause className="animation-hide absolute left-1/2 top-1/2 text-lg md:text-3xl" />
        )}
        {agent !== null && agentMode === PAUSE_MODE && !isAgentPaused && (
          <FaPlay className="animation-hide absolute left-1/2 top-1/2 text-lg md:text-3xl" />
        )}
        {messages.map((message, index) => {
          if (getTaskStatus(message) === TASK_STATUS_EXECUTING) {
            return null;
          }

          return (
            <FadeIn key={`${index}-${message.type}`}>
              <ChatMessage message={message} />
            </FadeIn>
          );
        })}
        {children}

        {messages.length === 0 && (
          <>
            <Expand delay={0.8} type="spring">
              <ChatMessage
                message={{
                  type: MESSAGE_TYPE_SYSTEM,
                  value: "👉 " + t("CREATE_AN_AGENT"),
                }}
              />
            </Expand>
            <Expand delay={0.9} type="spring">
              <ChatMessage
                message={{
                  type: MESSAGE_TYPE_SYSTEM,
                  value: `📢 ${t("YOU_CAN_PROVIDE_YOUR_OWN_OPENAI_KEY")}`,
                }}
              />
            </Expand>
          </>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  title?: string | ReactNode;
  messages: Message[];
  onSave?: (format: string) => void;
}

const MacWindowHeader = (props: HeaderProps) => {
  const [t] = useTranslation();
  const isAgentPaused = useAgentStore.use.isAgentPaused();
  const agent = useAgentStore.use.agent();
  const agentMode = useAgentStore.use.agentMode();
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

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    } else {
      // Fallback to a different method for unsupported browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        console.log("Text copied to clipboard");
      } catch (err) {
        console.error("Unable to copy text to clipboard", err);
      }

      document.body.removeChild(textArea);
    }
  };

  const exportOptions = [
    <WindowButton
      key="Image"
      onClick={(): void => saveElementAsImage(messageListId)}
      icon={<FaImage size={12} />}
      name={`${t("Image")}`}
    />,
    <WindowButton
      key="Copy"
      onClick={(): void => copyElementText(messageListId)}
      icon={<FaClipboard size={12} />}
      name={`${t("Copy")}`}
    />,
    <PDFButton key="PDF" name="PDF" messages={props.messages} />,
  ];

  return (
    <div className="flex items-center gap-1 overflow-visible rounded-t-3xl p-3">
      <PopIn delay={0.4}>
        <div className="h-3 w-3 rounded-full bg-red-500" />
      </PopIn>
      <PopIn delay={0.5}>
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
      </PopIn>
      <PopIn delay={0.6}>
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </PopIn>
      <Expand
        delay={1}
        className="invisible flex flex-grow font-mono text-sm font-bold text-gray-500 sm:ml-2 md:visible"
      >
        {props.title}
      </Expand>

      <AnimatePresence>
        {props.onSave && (
          <PopIn>
            <WindowButton
              ping
              key="Agent"
              onClick={() => props.onSave?.("db")}
              icon={<FaSave size={12} />}
              name={`${t("Save")}`}
              styleClass={{
                container: `relative bg-[#3a3a3a] md:w-20 text-center font-mono rounded-lg text-gray/50 border-[2px] border-white/30 font-bold transition-all sm:py-0.5 hover:border-[#1E88E5]/40 hover:bg-[#6b6b6b] focus-visible:outline-none focus:border-[#1E88E5]`,
              }}
            />
          </PopIn>
        )}
      </AnimatePresence>

      {agentMode === PAUSE_MODE && agent !== null && (
        <div
          className={`animation-duration text-gray/50 invisible flex items-center gap-2 px-2 py-1 text-left font-mono text-sm font-bold transition-all sm:py-0.5 md:visible`}
        >
          {isAgentPaused ? (
            <>
              <FaPause />
              <p className="font-mono">Paused</p>
            </>
          ) : (
            <>
              <FaPlay />
              <p className="font-mono">Running</p>
            </>
          )}
        </div>
      )}

      <Menu
        icon={<CgExport />}
        name={`${t("Export")}`}
        onChange={() => null}
        items={exportOptions}
        styleClass={{
          container: "relative",
          input: `bg-[#3a3a3a] animation-duration text-left py-1 px-2 text-sm font-mono rounded-lg text-gray/50 border-[2px] border-white/30 font-bold transition-all sm:py-0.5 hover:border-[#1E88E5]/40 hover:bg-[#6b6b6b] focus-visible:outline-none focus:border-[#1E88E5]`,
          option: "w-full py-[1px] md:py-0.5",
        }}
      />
    </div>
  );
};
const ChatMessage = forwardRef(
  (
    {
      message,
      className,
    }: {
      message: Message;
      className?: string;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [t] = useTranslation();
    const tasks = useMessageStore.use.tasks();
    const updateMessage = useMessageStore.use.updateMessage();
    const deleteMessage = useMessageStore.use.deleteMessage();
    const deleteTask = useMessageStore.use.deleteTask();
    const latestIteration = useMessageStore.use.latestIteration();

    const isMutableMessage =
      message.iteration === latestIteration &&
      isTask(message) &&
      message.status === TASK_STATUS_STARTED;

    const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(true);
    const [textAreaValue, setTextAreaValue] = useState(message.value);

    const messageButtonGroupRef = useRef<HTMLDivElement>(null);
    const editButtonGroupRef = useRef<HTMLDivElement>(null);
    const messageIconRef = useRef<HTMLDivElement>(null);
    const messagePrefixRef = useRef<HTMLSpanElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      toggleEditMessageStyles(!isTextAreaDisabled);
    }, [isTextAreaDisabled]);

    const toggleEditMessageStyles = (active) => {
      const initial = "initial";
      const none = "none";
      const inlineFlex = "inline-flex";
      const display = active ? none : initial;

      if (messageButtonGroupRef.current) {
        messageButtonGroupRef.current.style.display = active
          ? none
          : inlineFlex;
      }

      if (editButtonGroupRef.current) {
        editButtonGroupRef.current.style.display = active ? inlineFlex : none;
      }

      if (messageIconRef.current) {
        messageIconRef.current.style.display = active ? none : "inline-block";
      }

      if (messagePrefixRef.current) {
        messagePrefixRef.current.style.display = display;
      }

      if (textAreaRef.current) {
        textAreaRef.current.style.width = active ? "100%" : initial;
        textAreaRef.current.style.backgroundColor = active
          ? "#616161"
          : initial;
      }
    };

    const saveEdit = () => {
      setTextAreaValue((prevTextAreaValue) => prevTextAreaValue.trim());
      updateMessage({ ...message, value: textAreaValue });
      setIsTextAreaDisabled(true);
    };

    const cancelEdit = () => {
      setIsTextAreaDisabled(true);
    };

    const handleEditMessage = () => {
      setIsTextAreaDisabled(false);
    };

    const handleMessageKeyUp = (
      e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      const isSaveMessage = e.key === "Enter" && !e.shiftKey;

      if (isSaveMessage && isTask(message)) {
        saveEdit();
      }

      if (isSaveMessage || e.key === "Escape") {
        cancelEdit();
      }
    };

    const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextAreaValue(e.currentTarget.value);
    };

    const handleDeleteMessage = () => {
      deleteMessage(message);
      deleteTask(message);
    };

    const editButtonGroup = (
      <ButtonGroup
        styleClass={{
          container: "",
        }}
        ref={editButtonGroupRef}
      >
        <IconButton
          key="save"
          styleClass={{
            container: "w-8 h-8 hover:bg-[#8e8e93]",
          }}
          icon={<FaCheck />}
          toolTipProperties={{
            message: "Save",
            disabled: false,
          }}
          onClick={() => saveEdit()}
        />
        <IconButton
          key="cancel"
          styleClass={{ container: "w-8 h-8 hover:bg-[#8e8e93]" }}
          icon={<FaTimes />}
          toolTipProperties={{
            message: "Cancel",
            disabled: false,
          }}
          onClick={() => cancelEdit()}
        />
      </ButtonGroup>
    );

    const messageButtonGroup = (
      <ButtonGroup
        styleClass={{
          container:
            "hover:shadow absolute right-0 top-0 inline-flex rounded-tr-md",
        }}
        ref={messageButtonGroupRef}
      >
        <IconButton
          key="edit"
          styleClass={{
            container: "w-8 h-8 hover:bg-[#8e8e93] p-1",
          }}
          icon={<FaEdit />}
          toolTipProperties={{
            message: "Edit",
            disabled: false,
          }}
          onClick={handleEditMessage}
        />
        {tasks.length > 0 && (
          <IconButton
            key="delete"
            styleClass={{
              container:
                "w-8 h-8 rounded-tr-md hover:bg-red-500 hover:text-white p-1 text-red-500",
            }}
            icon={<FaTrashAlt />}
            toolTipProperties={{
              message: "Delete",
              disabled: false,
            }}
            disabled={tasks.length < 1}
            onClick={handleDeleteMessage}
          />
        )}
      </ButtonGroup>
    );

    return (
      <div
        className={`${getMessageContainerStyle(
          message
        )} relative mx-2 my-1 rounded-lg border-[2px] bg-white/20 px-2 font-mono text-sm hover:border-[#1E88E5]/40 sm:mx-4 sm:px-3 sm:text-base ${
          isTextAreaDisabled ? "pb-2 sm:pb-3" : "pt-2 sm:pt-3"
        } ${isMutableMessage || latestIteration === 0 ? "" : "opacity-60"} ${
          isMutableMessage ? "pt-7" : "pt-2 sm:pt-3"
        }`}
      >
        {message.type != MESSAGE_TYPE_SYSTEM && (
          // Avoid for system messages as they do not have an icon and will cause a weird space
          <>
            <div
              className="mr-2 inline-block h-[0.9em] align-top"
              ref={messageIconRef}
            >
              {getTaskStatusIcon(message, {})}
            </div>
            <span className="mr-2 align-top font-bold" ref={messagePrefixRef}>
              {getMessagePrefix(message, t)}
            </span>
          </>
        )}

        {message.type == MESSAGE_TYPE_THINKING && (
          <span className="italic text-zinc-400">
            (Redeploy if this takes more than 30 seconds)
          </span>
        )}

        {isAction(message) ? (
          <>
            <hr className="my-2 border-[1px] border-white/20" />
            <div className="prose max-w-none">
              <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
            </div>
          </>
        ) : (
          <>
            {isMutableMessage && !isTextAreaDisabled ? (
              <div>
                <textarea
                  className="lg:3/4 resize-none rounded-md border-none bg-transparent p-1.5 align-middle font-mono text-sm focus-visible:outline-none sm:text-base"
                  value={textAreaValue}
                  ref={textAreaRef}
                  disabled={isTextAreaDisabled}
                  onKeyUp={handleMessageKeyUp}
                  onInput={handleMessageInput}
                  maxLength={2000}
                  rows={3}
                />
                {editButtonGroup}
              </div>
            ) : (
              <span>{message.value}</span>
            )}
            {
              // Link to the FAQ if it is a shutdown message
              message.type == MESSAGE_TYPE_SYSTEM &&
                message.value.toLowerCase().includes("shut") && <FAQ />
            }
          </>
        )}
        {isMutableMessage && (
          <div>
            {messageButtonGroup}
            {/* {editButtonGroup} */}
          </div>
        )}
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

interface ButtonGroupProps {
  children: React.ReactNode;
  styleClass?: { [key: string]: string };
}

const ButtonGroup = forwardRef(
  (
    { children, styleClass }: ButtonGroupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div className={`${styleClass?.container || ""}`} role="group" ref={ref}>
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

const getMessagePrefix = (message: Message, t: Translation) => {
  if (message.type === MESSAGE_TYPE_GOAL) {
    return t("Embarking on a new goal:");
  } else if (message.type === MESSAGE_TYPE_THINKING) {
    return t("Thinking...");
  } else if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return t("Added task:");
  } else if (getTaskStatus(message) === TASK_STATUS_COMPLETED) {
    return `Completing: ${message.value}`;
  } else if (getTaskStatus(message) === TASK_STATUS_FINAL) {
    return t("No more subtasks for:");
  }
  return "";
};

const FAQ = () => {
  return (
    <p>
      <br />
      If you are facing any issues, please visit our{" "}
      <a
        href="https://reworkd.github.io/AgentGPT-Documentation/docs/faq"
        className="text-sky-500"
      >
        FAQ
      </a>
    </p>
  );
};
export default ChatWindow;
export { ChatMessage };
