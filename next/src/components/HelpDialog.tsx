import React from "react";
import { translate } from "../utils/translate";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function HelpDialog({ show, close }: { show: boolean; close: () => void }) {
  return (
    <Dialog header={`${translate("WELCOME_TO_AGENT_GPT", "help")} 🤖`} isShown={show} close={close}>
      <div>
        <p>
          <strong>AgentGPT</strong> {translate("INTRODUCING_AGENTGPT", "help")}
        </p>
        <br />
        <div>
          {translate("TO_LEARN_MORE_ABOUT_AGENTGPT", "help")}
          <a
            href="https://docs.reworkd.ai"
            className="text-sky-500"
          >
            {translate("AGENTGPT_DOCUMENTATION", "help")}
          </a>
        </div>
        <br />
        <p className="mt-2">{translate("FOLLOW_THE_JOURNEY", "help")}</p>
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
