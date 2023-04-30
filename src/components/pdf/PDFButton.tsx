import WindowButton from "../WindowButton";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import React, { memo } from "react";
import type { Message } from "../../types/agentTypes";
import { MESSAGE_TYPE_GOAL, MESSAGE_TYPE_TASK } from "../../types/agentTypes";

import { useTranslation } from "next-i18next";

const PDFButton = ({
  messages,
  name,
}: {
  messages: Message[];
  name: string;
}) => {
  const textSections = getTextSections(messages);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20; //margin
    textSections.forEach((text, index) => {
      const splittedText = doc.splitTextToSize(text, 180);
      doc.text(splittedText, 20, y, { align: "left" });
      y += splittedText.length * y/2 + y/2;
    });

    doc.save(`exported-${name}.pdf`);
  };

  return (
    <>
      <WindowButton
        onClick={() => {
          downloadPDF();
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
        return `${t("Goal: ")}${message.value}`;
      }
      if (message.type == MESSAGE_TYPE_TASK) {
        if (message.info) {
          return `${t(`Executing "${message.value}"`)} ${message.info}`;
        } else {
          return `${t("Adding Task:")} ${message.value}`;
        }
      }
      return message.value;
    })
    .filter((message) => message !== "");
};

export default memo(PDFButton);
