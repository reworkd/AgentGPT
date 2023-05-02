import WindowButton from "../WindowButton";
import { FaFilePdf } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import React, { memo } from "react";
import type { Message } from "../../types/agentTypes";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_TASK } from "../../types/agentTypes";

import { useTranslation } from "react-i18next";

const PDFButton = ({
  messages,
  name,
}: {
  messages: Message[];
  name: string;
}) => {
  const textSections = getTextSections(messages);

  const downloadPDF = async () => {
    const MyDocument = (await import("./MyDocument")).default as React.FC<{
      textSections: string[];
    }>;

    const blob = await pdf(<MyDocument textSections={textSections} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-document.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <WindowButton
        onClick={() => {
          downloadPDF().catch(console.error);
        }}
        icon={<FaFilePdf size={12} />}
        name={name}
      />
    </>
  );
};

const getTextSections = (messages: Message[]): string[] => {
  const [t] = useTranslation();

  // Note "Thinking" messages have no `value` so they show up as new lines
  return messages
    .map((message) => {
      if (message.type == MESSAGE_TYPE_GOAL) {
        return `${t("AGENT_GOAL", { ns: "indexPage" })}: ${message.value}`;
      }
      if (message.type == MESSAGE_TYPE_TASK) {
        if (message.info) {
          return `${t("EXECUTING", { ns: "common" })} "${message.value}": ${
            message.info
          }`;
        } else {
          return `${t("ADDING_TASK", { ns: "common" })}: ${message.value}`;
        }
      }
      return message.value;
    })
    .filter((message) => message !== "");
};

export default memo(PDFButton);
