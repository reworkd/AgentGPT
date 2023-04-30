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
      header={`${t("Welcome to AgentGPT 🤖")} 🤖`}
      isShown={show}
      close={close}
    >
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p>
          <strong>AgentGPT</strong>{" "}
          {t(
            "allows you to configure and deploy Autonomous AI agents. Name your custom AI and have it embark on any goal imaginable. It will attempt to reach the goal by thinking of tasks to do, executing them, and learning from the results 🚀"
          )}
        </p>
        <div>
          <br />
          {t("To learn more about AgentGPT, its roadmap, FAQ, etc, visit the ")}
          <a
            href="https://reworkd.github.io/AgentGPT-Documentation/docs/intro"
            className="text-sky-500"
          >
            AgentGPT Documentation
          </a>
          <br />
          <p className="mt-2">{t("Join the community below:")}</p>
        </div>
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
