/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import Dialog from "./Dialog";
import { useTranslation } from "next-i18next";

export interface SorryDialogProps {
  show: boolean;
  close: () => void;
}

export const SorryDialog = ({ show, close }: SorryDialogProps) => {
  const [t] = useTranslation();

  return (
    <Dialog header={`${t("SORRY_TITLE", { ns: "sorryDialog" })}`} isShown={show} close={close}>
      <p>{`${t("REASON_OF_DISABLE_WEB_SEARCH", "REASON_OF_DISABLE_WEB_SEARCH", {
        ns: "sorryDialog",
      })}`}</p>
      <br />
      <p>
        {`${t("PLEASE_MONITOR", "PLEASE_MONITOR", {
          ns: "sorryDialog",
        })}`}
        <a
          className="link"
          href="https://reworkd.github.io/AgentGPT-Documentation/docs/roadmap"
          target="_blank"
          rel="noreferrer"
        >
          {`${t("ROADMAP", { ns: "sorryDialog" })}`}
        </a>
        {`${t("PLEASE_MONITOR_END_TEXT", "PLEASE_MONITOR_END_TEXT", {
          ns: "sorryDialog",
        })}`}
      </p>
    </Dialog>
  );
};
