import React from "react";
import { useTranslation } from "next-i18next";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function HelpDialog({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) {
  const [t] = useTranslation();
  return (
    <Dialog
      header={`${t("WELCOME_TO_AGENT_GPT", { ns: "help" })} 🤖`}
      isShown={show}
      close={close}
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
          <a
            href="https://reworkd.github.io/AgentGPT-Documentation/docs/intro"
            className="text-sky-500"
          >
            {t("AGENTGPT_DOCUMENTATION", { ns: "help" })}
          </a>
        </div>
        <br />
        <p className="mt-2">{t("FOLLOW_THE_JOURNEY", { ns: "help" })}</p>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open("https://discord.gg/jdSBAnmdnY", "_blank")
            }
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
            onClick={() =>
              window.open("https://github.com/reworkd/AgentGPT", "_blank")
            }
          >
            <FaGithub size={30} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
