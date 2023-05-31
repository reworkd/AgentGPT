import React from "react";
import {
  getTaskStatus,
  Message,
  MESSAGE_TYPE_GOAL,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/agentTypes";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";
import MarkdownRenderer from "./MarkdownRenderer";
import Loader from "../loader";
import FadingHr from "../FadingHr";

const ChatMessage = ({ message }: { message: Message }) => {
  const [t] = useTranslation();

  const icon = getTaskStatusIcon(message, {});
  const messagePrefix = getMessagePrefix(message);

  return (
    <div
      className={clsx(
        getMessageContainerStyle(message),
        "mx-2 my-1 rounded-lg border p-1 font-mono text-xs hover:border-[#1E88E5]/40 sm:mx-4 sm:p-2",
        "bg-gradient-to-t transition-all hover:from-neutral-800",
        "sm:my-1.5 sm:text-sm"
      )}
    >
      <div className="flex flex-row">
        {message.type !== "system" && (
          <span className={clsx("text-gray-200", message.type == "goal" && "pr-2")}>{icon}</span>
        )}
        <span className={clsx("text-left", message.type === "thinking" && "flex-grow")}>
          {t(messagePrefix, { ns: "chat" })}
        </span>
        {message.type === "system" && (
          <span className="flex-grow pl-1">{t(message.value, { ns: "chat" })}</span>
        )}
        {message.type == "goal" && (
          <span className="flex-grow pl-1 text-gray-400">{t(message.value, { ns: "chat" })}</span>
        )}
        {message.type == "task" && !messagePrefix.includes(message.value) && (
          <span className="pl-1 text-gray-400">{t(message.value, { ns: "chat" })}</span>
        )}
        {message.type === "thinking" && <Loader />}
      </div>

      {message.info && (
        <>
          <FadingHr className="my-2" />
          <div className="prose px-1 pt-2">
            <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
          </div>
        </>
      )}

      {message.type === "error" && <FAQ />}
    </div>
  );
};
// Returns the translation key of the prefix
const getMessagePrefix = (message: Message) => {
  if (message.type === MESSAGE_TYPE_GOAL) {
    return "EMBARKING_ON_NEW_GOAL";
  } else if (message.type === "thinking") {
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
export { ChatMessage };
