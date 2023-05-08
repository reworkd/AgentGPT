import React from "react";
import Dialog from "./Dialog";

export interface SorryDialogProps {
  show: boolean;
  close: () => void;
}

export const SorryDialog = ({ show, close }: SorryDialogProps) => {
  return (
    <Dialog header="Sorry! 😭" isShown={show} close={close}>
      <p>Due to costs, we&apos;ve had to momentarily disable web search 🌐</p>
      <br />
      <p>
        Please monitor our&nbsp;
        <a
          className="link"
          href="https://reworkd.github.io/AgentGPT-Documentation/docs/roadmap"
          target="_blank"
          rel="noreferrer"
        >
          Roadmap
        </a>
        &nbsp; to understand when it may be back up.
      </p>
    </Dialog>
  );
};
