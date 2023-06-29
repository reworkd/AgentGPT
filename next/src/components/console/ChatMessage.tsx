import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";
import MarkdownRenderer from "./MarkdownRenderer";
import type { Message } from "../../types/message";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_SYSTEM } from "../../types/message";
import Button from "../../ui/button";
import {
  getTaskStatus,
  isAction,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/task";
import { FaCheck, FaClipboard } from "react-icons/fa";

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

  return (
    <div
      className={clsx(
        getMessageContainerStyle(message),
        "mx-2 my-1 rounded-lg border bg-white/20 p-2 font-mono text-xs hover:border-[#1E88E5]/40 sm:mx-4 sm:p-3",
        "sm:my-1.5 sm:text-sm"
      )}
    >
      {message.type !== MESSAGE_TYPE_SYSTEM && (
        <>
          <div className="mr-2 inline-block h-[0.9em]">{getTaskStatusIcon(message, {})}</div>
          <span className="mr-2 font-bold">{getMessagePrefix(message)}</span>
        </>
      )}

      {isAction(message) ? (
        <>
          <Button
            className="ml-2 justify-end text-zinc-500 hover:text-zinc-700"
            onClick={handleCopy}
            aria-label="Copy"
          >
            {isCopied ? <FaCheck /> : <FaClipboard />}
          </Button>
          <hr className="my-2 border border-white/20" />
          <div className="prose">
            <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
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
// Returns the translation key of the prefix
const getMessagePrefix = (message: Message) => {
  if (message.type === MESSAGE_TYPE_GOAL) {
    return "Embarking on a new goal";
  } else if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return "Task Added:";
  } else if (getTaskStatus(message) === TASK_STATUS_COMPLETED) {
    return `Executing: ${message.value}`;
  } else if (getTaskStatus(message) === TASK_STATUS_FINAL) {
    return `Finished:`;
  }
  return "";
};
export { ChatMessage };
