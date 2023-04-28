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
  const [ t ] = useTranslation();
  return (
    <Dialog
<<<<<<< HEAD
      header={t('WELCOME_TO_AGENT_GPT','WELCOME_TO_AGENT_GPT', {ns: 'help'})}
=======
      header={`${t("Welcome to AgentGPT 🤖")} 🤖`}
>>>>>>> 6c1b509 (✨ Add links to FAQ)
      isShown={show}
      close={close}
    >
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p>
          <strong>AgentGPT</strong>{" "}
          {t('INTRODUCING_AGENTGPT','INTRODUCING_AGENTGPT', {ns: 'help'})}
        </p>
        <div>
          <br />
<<<<<<< HEAD
          {t('PLATFORM_BETA_DESCRIPTION','PLATFORM_BETA_DESCRIPTION', {ns: 'help'})}
          <ul className="ml-5 list-inside list-disc">
            <li>{t('LONG_TERM_MEMORY','LONG_TERM_MEMORY', {ns: 'help'})}</li>
            <li>{t('WEB_BROWSING','WEB_BROWSING', {ns: 'help'})}</li>
            <li>{t('INTERACTION_WITH_WEBSITES_AND_PEOPLE','INTERACTION_WITH_WEBSITES_AND_PEOPLE', {ns: 'help'})}</li>
          </ul>
          <br />
          <p className="mt-2">{t('FOLLOW_THE_JOURNEY','FOLLOW_THE_JOURNEY', {ns: 'help'})}</p>
=======
          {t("To learn more about AgentGPT, its roadmap, FAQ, etc, visit the ")}
          <a
            href="https://reworkd.github.io/AgentGPT-Documentation/docs/intro"
            className="text-sky-500"
          >
            AgentGPT Documentation
          </a>
          <br />
          <p className="mt-2">{t("Join the community below:")}</p>
>>>>>>> 6c1b509 (✨ Add links to FAQ)
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
