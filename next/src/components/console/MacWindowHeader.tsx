import { useTranslation } from "next-i18next";
import * as htmlToImage from "html-to-image";
import WindowButton from "../WindowButton";
import { FaClipboard, FaImage, FaSave } from "react-icons/fa";
import PDFButton from "../pdf/PDFButton";
import Expand from "../motions/expand";
import { AnimatePresence } from "framer-motion";
import Menu from "../Menu";
import { CgExport } from "react-icons/cg";
import React, { PropsWithChildren } from "react";
import type { HeaderProps } from "../../utils/types";
import { messageListId } from "../../utils/constants";
import PopIn from "../motions/popin";
import clsx from "clsx";

const Tab = (props: PropsWithChildren<{ onClick: () => void; active: boolean }>) => (
  <button
    className={clsx(
      "z-1 ml-1 -translate-y-9 rounded-t-lg border-[2px] border-b-0 border-white/20 bg-zinc-900 px-2 text-sm text-gray-300 transition-all",
      props.active && "bg-zinc-900"
    )}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export const MacWindowHeader = (
  props: HeaderProps & {
    tabs: {
      title: string;
      isActive: boolean;
      onCLick: () => void;
    }[];
  }
) => {
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
    <div className="bg-g flex items-center gap-1 overflow-visible rounded-t-3xl p-3">
      <div className="absolute xl:hidden">
        {props.tabs.map((t, i) => (
          <Tab key={i} onClick={t.onCLick} active={t.isActive}>
            {t.title}
          </Tab>
        ))}
      </div>
      <PopIn delay={0.4}>
        <div className="h-3 w-3 rounded-full bg-red-500" />
      </PopIn>
      <PopIn delay={0.5}>
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
      </PopIn>
      <PopIn delay={0.6} className="mr-2">
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </PopIn>

      <Expand delay={1} className="flex-grow font-mono text-sm font-bold text-gray-500 sm:ml-2">
        {props.title}
      </Expand>

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
