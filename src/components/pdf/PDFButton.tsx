/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { memo, useState, useEffect } from "react";
import ReactPDF, {
  Document,
  Font,
  Page,
  pdf,
  StyleSheet,
  Text,
} from "@react-pdf/renderer";
import View = ReactPDF.View;
import jsPDF from "jspdf";
import WindowButton from "../WindowButton";
import { FaFilePdf } from "react-icons/fa";
import type { Message } from "../../types/agentTypes";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_TASK } from "../../types/agentTypes";
import { useTranslation, i18n } from "next-i18next";

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
  // Note "Thinking" messages have no `value` so they show up as new lines
  return messages
    .map((message) => {
      if (message.type == MESSAGE_TYPE_GOAL) {
        return `${i18n?.t("LABEL_AGENT_GOAL", { ns: "indexPage" })}: ${
          message.value
        }`;
      }
      if (message.type == MESSAGE_TYPE_TASK) {
        if (message.info) {
          return `${i18n?.t("EXECUTING", { ns: "common" })}: "${
            message.value
          }": ${message.info}`;
        } else {
          return `${i18n?.t("ADDING_TASK", { ns: "common" })}: ${
            message.value
          }`;
        }
      }
      return message.value;
    })
    .filter((message) => message !== "");
};

export default memo(PDFButton);
