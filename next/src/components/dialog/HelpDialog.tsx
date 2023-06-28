import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function HelpDialog() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = "agentgpt-modal-opened-v0.2";
    const savedModalData = localStorage.getItem(key);

    setTimeout(() => {
      if (savedModalData == null) {
        setShow(true);
      }
    }, 1800);

    localStorage.setItem(key, JSON.stringify(true));
  }, []);

  const [t] = useTranslation();
  return (
    <Dialog
      header={`${t("WELCOME_TO_AGENT_GPT", { ns: "help" })} 🤖`}
      isShown={show}
      close={() => setShow(false)}
    >
      <div>
        <p>
          <strong>AgentGPT</strong> {t("INTRODUCING_AGENTGPT", { ns: "help" })}
        </p>
        <br />
        <div>
          {t("TO_LEARN_MORE_ABOUT_AGENTGPT", {
            ns: "help",
          })}
          <a href="https://docs.reworkd.ai" className="text-sky-500">
            {t("AGENTGPT_DOCUMENTATION", { ns: "help" })}
          </a>
        </div>
        <br />
        <p className="mt-2">{t("FOLLOW_THE_JOURNEY", { ns: "help" })}</p>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() => window.open("https://discord.gg/jdSBAnmdnY", "_blank")}
          >
            <FaDiscord size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open(
                "https://twitter.com/asimdotshrestha/status/1644883727707959296",
                "_blank"
              )
            }
          >
            <FaTwitter size={30} />
          </div>
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() => window.open("https://github.com/reworkd/AgentGPT", "_blank")}
          >
            <FaGithub size={30} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
