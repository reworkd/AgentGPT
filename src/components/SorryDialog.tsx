/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import Dialog from "./Dialog";
import { i18n } from "next-i18next";

export interface SorryDialogProps {
  show: boolean;
  close: () => void;
}

export const SorryDialog = ({ show, close }: SorryDialogProps) => {
  return (
    <Dialog
      header={`${i18n?.t("SORRY_TITLE", "SORRY_TITLE", { ns: "sorryDialog" })}`}
      isShown={show}
      close={close}
    >
      <p>{`${i18n?.t(
        "REASON_OF_DISABLE_WEB_SEARCH",
        "REASON_OF_DISABLE_WEB_SEARCH",
        { ns: "sorryDialog" }
      )}`}</p>
      <br />
      <p>
        {`${i18n?.t("PLEASE_MONITOR", "PLEASE_MONITOR", {
          ns: "sorryDialog",
        })}`}
        <a
          className="link"
          href="https://reworkd.github.io/AgentGPT-Documentation/docs/roadmap"
          target="_blank"
          rel="noreferrer"
        >
          {`${i18n?.t("ROADMAP", "ROADMAP", { ns: "sorryDialog" })}`}
        </a>
        {`${i18n?.t("PLEASE_MONITOR_END_TEXT", "PLEASE_MONITOR_END_TEXT", {
          ns: "sorryDialog",
        })}`}
      </p>
    </Dialog>
  );
};
