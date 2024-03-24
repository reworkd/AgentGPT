import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiClipboard } from "react-icons/fi";

import MarkdownRenderer from "./MarkdownRenderer";
import SourceCard from "./SourceCard";
import type { Message } from "../../types/message";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_SYSTEM } from "../../types/message";
import {
  getTaskStatus,
  isAction,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/task";
import Button from "../../ui/button";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";

const ChatMessage = ({ message }: { message: Message }) => {
  const [t] = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    try {
      const textToCopy = isAction(message) ? message.info || "" : message.value;
      void navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (message.type === MESSAGE_TYPE_GOAL && !isAction(message)) {
    return <div className="pb-2 text-2xl sm:text-4xl">{message.value}</div>;
  }
  return (
    <div
      className={clsx(
        getMessageContainerStyle(message),
        "my-1 mr-2 rounded-lg bg-slate-1 p-2 text-xs shadow-depth-1 hover:border-[#1E88E5]/40 sm:mr-4 sm:p-3",
        "sm:my-1.5 sm:text-sm",
        !isAction(message) && "w-fit max-w-full"
      )}
    >
      {message.type !== MESSAGE_TYPE_SYSTEM && !isAction(message) && (
        <>
          <div className="mr-2 inline-block h-[0.9em]">{getTaskStatusIcon(message, {})}</div>
          <span className="mr-2 font-bold">{getMessagePrefix(message)}</span>
        </>
      )}

      {isAction(message) ? (
        <>
          <div className="flex flex-row">
            <div className="mr-2 inline-block h-[0.9em]">{getTaskStatusIcon(message, {})}</div>
            <span className="mr-2 flex-1 font-bold">{getMessagePrefix(message)}</span>
            <Button
              className="justify-end rounded-md text-slate-10 hover:bg-slate-6 hover:text-slate-12"
              onClick={handleCopy}
              aria-label="Copy"
            >
              <div className="w-full">{isCopied ? <FaCheck /> : <FiClipboard size={15} />}</div>
            </Button>
          </div>
          <hr className="my-2 border border-white/20" />
          <div>
            <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
            <SourceCard content={message.info || ""} />
          </div>
        </>
      ) : (
        <>
          <span>{message.value}</span>
          {message.type === MESSAGE_TYPE_SYSTEM &&
            (message.value.toLowerCase().includes("shut") ||
              message.value.toLowerCase().includes("error")) && <FAQ />}
        </>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <p>
      <br />
      If you are facing issues, please head over to our{" "}
      <a href="https://docs.reworkd.ai/essentials/FAQ" className="text-sky-500">
        FAQ
      </a>
    </p>
  );
};

// Returns the translation key of the prefix
const getMessagePrefix = (message: Message) => {
  if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return "Task Added:";
  } else if (getTaskStatus(message) === TASK_STATUS_COMPLETED) {
    return message.value;
  } else if (getTaskStatus(message) === TASK_STATUS_FINAL) {
    return `Finished:`;
  }
  return "";
};
export { ChatMessage };
