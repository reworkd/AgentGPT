import React from "react";

import { ChatMessage } from "./ChatMessage";
import { ExampleAgentButton } from "./ExampleAgentButton";
import { MESSAGE_TYPE_SYSTEM } from "../../types/message";
import FadeIn from "../motions/FadeIn";
import Button from "../Button";
import { useTools } from "../../hooks/useTools";
import { useSession } from "next-auth/react";
import OauthApi from "../../services/workflow/oauthApi";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";


type ExampleAgentsProps = {
  setAgentRun?: (name: string, goal: string) => void;
  handleConnectSID: () => void;
};

const ExampleAgents = ({ setAgentRun, handleConnectSID }: ExampleAgentsProps) => {
  const { data: session } = useSession();
  const api = OauthApi.fromSession(session);

  const { data, refetch, isError } = useQuery(
    ['sid_info', session],
    async () => await api.get_info_sid(),
    {
      enabled: !!session,
      retry: false,
    }
  );

  return (
    <>
      <FadeIn delay={0.8} duration={0.5}>
        <ChatMessage
          message={{
            type: MESSAGE_TYPE_SYSTEM,
            value:
              "👉 Create an agent by adding a name / goal, and hitting deploy! Try our examples below!",
          }}
        />
      </FadeIn>
      <FadeIn delay={0.9} duration={0.5}>
        <div className="m-2 grid grid-cols-1 items-stretch gap-2 sm:m-4 sm:grid-cols-3 grid-rows-2">
          <ExampleAgentButton name="PlatformerGPT 🎮" setAgentRun={setAgentRun}>
            Write some code to make a platformer game.
          </ExampleAgentButton>
          <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
            Plan a detailed trip to Hawaii.
          </ExampleAgentButton>
          <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
            Create a comprehensive report of the Nike company
          </ExampleAgentButton>
          {(!!session || (data?.connected ?? false)) ?
            <ExampleAgentButton name="AssistantGPT 🛟" setAgentRun={setAgentRun}>
              Summarize our user metrics notion page.
            </ExampleAgentButton> :
            <div
              className={clsx(
                `w-full p-2`,
                `cursor-default rounded-lg font-mono text-sm sm:text-base`,
                `border border-white/20 bg-gradient-to-t from-sky-500 to-sky-600`
              )}
            >
              <p className="text-lg font-black">AssistantGPT 🛟</p>
              <p className="mt-2 text-sm">Connect your data to use this agent</p>
              <div className="grid justify-items-center">
                <Button className="mt-2 " onClick={handleConnectSID}> Connect your Data</Button>
              </div>
            </div>
          }
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
