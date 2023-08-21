import clsx from "clsx";
import { useSession } from "next-auth/react";
import React from "react";

import { ChatMessage } from "./ChatMessage";
import { ExampleAgentButton } from "./ExampleAgentButton";
import { useSID } from "../../hooks/useSID";
import { MESSAGE_TYPE_SYSTEM } from "../../types/message";
import Button from "../Button";
import FadeIn from "../motions/FadeIn";

type ExampleAgentsProps = {
  setAgentRun?: (name: string, goal: string) => void;
  setShowSignIn: (show: boolean) => void;
};

const ExampleAgents = ({ setAgentRun, setShowSignIn }: ExampleAgentsProps) => {
  const { data: session } = useSession();
  const sid = useSID(session);

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
        <div className="m-2 grid grid-cols-1 grid-rows-2 items-stretch gap-2 sm:m-4 sm:grid-cols-3">
          <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
            Plan a detailed trip to Hawaii.
          </ExampleAgentButton>

          <div
            className={clsx(
              `w-full p-2`,
              `cursor-pointer rounded-lg font-mono text-sm sm:text-base`,
              `border border-white/20 bg-gradient-to-t from-sky-500 to-sky-600 transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600`
            )}
            onClick={() => {
              if (!session?.user) setShowSignIn(true);
              else if (!sid?.connected) sid.install().catch(console.error);
              else
                setAgentRun?.(
                  "AssistantGPT",
                  "Based on my personal data, evaluate my personal goals and give me advice."
                );
            }}
          >
            <p className="text-lg font-black">AssistantGPT 🛟</p>
            <p className="mt-2 text-sm">Get tailored advice based on your own data</p>
            <Button
              ping={!sid?.connected}
              className={clsx(
                "w-full border-white/20 bg-gradient-to-t from-amber-500 to-amber-600 transition-all hover:bg-gradient-to-t hover:from-amber-400 hover:to-amber-600 sm:mt-4",
                sid.connected && "hidden"
              )}
              onClick={async () => {
                if (!session?.user) setShowSignIn(true);
                else await sid.install();
              }}
              loader
            >
              Connect your Data
            </Button>
          </div>

          <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
            Create a comprehensive report of the Nike company
          </ExampleAgentButton>
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
