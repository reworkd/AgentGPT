import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {FaXTwitter} from 'react-icons/fa6';

import Dialog from "../../ui/dialog";

export default function HelpDialog() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = "agentgpt-modal-opened-v0.2";
    const savedModalData = localStorage.getItem(key);

    setTimeout(() => {
      if (savedModalData == null) {
        setShow(true);
      }
    }, 1500);

    localStorage.setItem(key, JSON.stringify(true));
  }, []);

  const [t] = useTranslation();
  return (
    <Dialog
      inline
      open={show}
      setOpen={setShow}
      title="Welcome!"
      actions={
        <>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400"
            onClick={() => {
              setShow(false);
            }}
          >
            Get Started
          </button>
        </>
      }
    >
      <div>
        <p>
          AgentGPT is the next generation of Google search. Ask any question and watch as an AI
          Agent gives you the perfect answer after aggregating relevant sources from across the
          internet.
        </p>
        <br />
        <p className="mt-2 text-center font-bold">{t("FOLLOW_THE_JOURNEY", { ns: "help" })}</p>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
          <div
            className="cursor-pointer rounded-full bg-slate-6 p-3 hover:bg-slate-8"
            onClick={() => window.open("https://discord.gg/jdSBAnmdnY", "_blank")}
          >
            <FaDiscord size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-slate-6 p-3 hover:bg-slate-8"
            onClick={() =>
              window.open(
                "https://twitter.com/asimdotshrestha/status/1644883727707959296",
                "_blank"
              )
            }
          >
            <FaXTwitter size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-slate-6 p-3 hover:bg-slate-8"
            onClick={() => window.open("https://github.com/reworkd/AgentGPT", "_blank")}
          >
            <FaGithub size={30} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
