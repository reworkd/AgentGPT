/* eslint-disable @typescript-eslint/restrict-template-expressions */
import WindowButton from "../WindowButton";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import React, { memo, useState, useEffect } from "react";
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
  const [language, setLanguage] = useState<string>();

  useEffect(() => {
    setLanguage(i18n?.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    const fontUrl = {
      ru: "./fonts/russian.ttf",
      zh: "./fonts/chinese.ttf",
      ja: "./fonts/japanese.ttf",
    }[i18n?.language || "en"];

    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = doc.getLineHeightFactor();
    let y = 10;

    getTextSections(messages).forEach((text, index) => {
      let splittedText = doc.splitTextToSize(text, 180) as string;
      if (splittedText.length <= 0) {
        splittedText = text;
      }
      doc.setFontSize(12);
      if (fontUrl) {
        doc.addFont(fontUrl, "customfont", "normal");
        doc.setFont("customfont");
      }
      if (y + doc.getTextDimensions(splittedText).h * lineHeight > pageHeight) {
        doc.addPage();
        y = 10;
        doc.text(splittedText, 20, y, {
          align: "left",
        });
        y += doc.getTextDimensions(splittedText).h;
      } else {
        doc.text(splittedText, 20, y, {
          align: "left",
        });
        y += lineHeight * doc.getTextDimensions(splittedText).h;
      }
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
};

const getTextSections = (messages: Message[]): string[] => {
  // Note "Thinking" messages have no `value` so they show up as new line
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
