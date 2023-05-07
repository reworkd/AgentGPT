import WindowButton from "../WindowButton";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import React, { memo, useState, useEffect } from "react";
import type { Message } from "../../types/agentTypes";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_TASK } from "../../types/agentTypes";
import { i18n } from "next-i18next";

const PDFButton = ({
  messages,
  name,
}: {
  messages: Message[];
  name: string;
}) => {
  const textSections = getTextSections(messages);
  const [language, setLanguage] = useState<any>();

  useEffect(() => {
    setLanguage(i18n?.language);
  },[i18n?.language])

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const fontUrl = {
      ru: "./fonts/russian.ttf",
      zh: "./fonts/chinese.ttf",
      ja: "./fonts/japanese.ttf",
    }[language];
    if (fontUrl) {
      doc.addFont(fontUrl, "customfont", "normal");
      doc.setFont("customfont");
    }
    getTextSections(messages).forEach((text, index) => {
      const splittedText = doc.splitTextToSize(text, 180);
      doc.text(splittedText, 20, index * 10 + 10, { align: "left" });
    });
    doc.save(`export-${name}.pdf`);
  };

  return (
    <WindowButton
      onClick={downloadPDF}
      icon={<FaFilePdf size={12} />}
      name="PDF"
    />
  );
}

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
          return `${i18n?.t("EXECUTING", { ns: "common" })} "${message.value}": ${
            message.info
          }`;
        } else {
          return `${i18n?.t("ADDING_TASK", { ns: "common" })}: ${message.value}`;
        }
      }
      return message.value;
    })
    .filter((message) => message !== "");
};

export default memo(PDFButton);
