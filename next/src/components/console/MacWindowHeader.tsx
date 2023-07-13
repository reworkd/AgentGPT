import { useTranslation } from "next-i18next";
import * as htmlToImage from "html-to-image";
import WindowButton from "../WindowButton";
import { FaImage } from "react-icons/fa";
import PDFButton from "../pdf/PDFButton";
import PopIn from "../motions/popin";
import Expand from "../motions/expand";
import Menu from "../Menu";
import { CgExport } from "react-icons/cg";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import type { Message } from "../../types/message";
import { FiClipboard } from "react-icons/fi";
import clsx from "clsx";

export const messageListId = "chat-window-message-list";

export interface HeaderProps {
  title?: string | ReactNode;
  messages: Message[];
}

export const MacWindowHeader = (props: HeaderProps) => {
  const [t] = useTranslation();

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
      name={t("IMAGE", { ns: "common" })}
    />,
    <WindowButton
      key="Copy"
      onClick={(): void => copyElementText(messageListId)}
      icon={<FiClipboard size={12} />}
      name={t("COPY", { ns: "common" })}
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
        delay={0.75}
        className="flex flex-grow font-mono text-xs font-bold text-gray-500 sm:ml-2 sm:text-sm"
      >
        {props.title}
      </Expand>
      <Menu icon={<CgExport size={15} />} items={exportOptions} />
    </div>
  );
};

interface MacWindowInternalProps extends PropsWithChildren {
  className?: string;
}

export const MacWindowInternal = (props: MacWindowInternalProps) => {
  return (
    <div
      className={clsx(
        "ml-2 flex items-baseline gap-1 overflow-visible rounded-t-3xl p-1.5",
        props.className
      )}
    >
      <PopIn delay={0.4}>
        <div className="h-2 w-2 rounded-full bg-red-500" />
      </PopIn>
      <PopIn delay={0.5}>
        <div className="h-2 w-2 rounded-full bg-yellow-500" />
      </PopIn>
      <PopIn delay={0.6}>
        <div className="h-2 w-2 rounded-full bg-green-500" />
      </PopIn>
      <Expand
        delay={0.75}
        className="ml-1 flex flex-grow font-mono text-[8pt] font-bold text-gray-400"
      >
        {props.children}
      </Expand>
    </div>
  );
};
