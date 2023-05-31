import { useTranslation } from "next-i18next";
import { useAgentStore } from "../../stores";
import * as htmlToImage from "html-to-image";
import WindowButton from "../WindowButton";
import { FaClipboard, FaImage, FaPause, FaPlay, FaSave } from "react-icons/fa";
import PDFButton from "../pdf/PDFButton";
import PopIn from "../motions/popin";
import Expand from "../motions/expand";
import { Message, PAUSE_MODE } from "../../types/agentTypes";
import { AnimatePresence } from "framer-motion";
import Menu from "../Menu";
import { CgExport } from "react-icons/cg";
import React, { ReactNode } from "react";

export const messageListId = "chat-window-message-list";

export interface HeaderProps {
  title?: string | ReactNode;
  messages: Message[];
  onSave?: (format: string) => void;
}

export const MacWindowHeader = (props: HeaderProps) => {
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
      .catch(() =>
        alert("Error saving image! Note this doesn't work if the AI generated an image")
      );
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
      name={`${t("IMAGE", { ns: "common" })}`}
    />,
    <WindowButton
      key="Copy"
      onClick={(): void => copyElementText(messageListId)}
      icon={<FaClipboard size={12} />}
      name={`${t("COPY", { ns: "common" })}`}
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

      {agentMode === PAUSE_MODE && agent !== null && (
        <div
          className={`animation-duration text-gray/50 flex items-center gap-2 px-2 py-1 text-left font-mono text-sm font-bold transition-all sm:py-0.5`}
        >
          {isAgentPaused ? (
            <>
              <FaPause />
              <p className="font-mono">{`${t("PAUSED", { ns: "common" })}`}</p>
            </>
          ) : (
            <>
              <FaPlay />
              <p className="font-mono">{`${t("RUNNING", { ns: "common" })}`}</p>
            </>
          )}
        </div>
      )}

      <AnimatePresence>
        {props.onSave && (
          <PopIn>
            <WindowButton
              ping
              key="Agent"
              onClick={() => props.onSave?.("db")}
              icon={<FaSave size={12} />}
              name={`${t("SAVE", { ns: "common" })}`}
              border
            />
          </PopIn>
        )}
      </AnimatePresence>

      <Menu icon={<CgExport size={15} />} items={exportOptions} />
    </div>
  );
};
