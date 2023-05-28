/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import Dialog from "./Dialog";
import { translate } from "../utils/translate";
export interface SorryDialogProps {
  show: boolean;
  close: () => void;
}

export const SorryDialog = ({ show, close }: SorryDialogProps) => {
  return (
    <Dialog header={`${translate("SORRY_TITLE", "sorryDialog")}`} isShown={show} close={close}>
      <p>{`${translate("REASON_OF_DISABLE_WEB_SEARCH", "sorryDialog")}`}</p>
      <br />
      <p>
        {`${translate("PLEASE_MONITOR", "sorryDialog")}`}
        <a
          className="link"
          href="https://docs.reworkd.ai/roadmap"
          target="_blank"
          rel="noreferrer"
        >
          {`${translate("ROADMAP", "sorryDialog")}`}
        </a>
        {`${translate("PLEASE_MONITOR_END_TEXT", "sorryDialog")}`}
      </p>
    </Dialog>
  );
};
