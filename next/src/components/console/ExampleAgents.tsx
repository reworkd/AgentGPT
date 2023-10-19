import { useSession } from "next-auth/react";
import React from "react";

import { ExampleAgentButton } from "./ExampleAgentButton";
import { useSID } from "../../hooks/useSID";
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
      <FadeIn delay={0.9} duration={0.5}>
        <div className="my-2 grid grid-cols-1 items-stretch gap-2 sm:my-4 sm:grid-cols-3">
          <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
            Plan a detailed trip to Hawaii
          </ExampleAgentButton>

          <ExampleAgentButton name="CalculusGPT 📚" setAgentRun={setAgentRun}>
            Create a study plan for an intro to Calculus exam
          </ExampleAgentButton>

          <ExampleAgentButton name="HustleGPT 🚀" setAgentRun={setAgentRun}>
            Create a comprehensive report for how to scale a startup to 1000 customers
          </ExampleAgentButton>
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
