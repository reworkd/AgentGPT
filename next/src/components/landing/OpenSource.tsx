import clsx from "clsx";
import React from "react";
import { FaGithub } from "react-icons/fa";

import { MacWindowInternal } from "../console/MacWindowHeader";
import PrimaryButton from "../PrimaryButton";

interface TerminalProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

const OpenSource = () => {
  return (
    <div className="min-h-[50vh] w-full">
      <div className="flex flex-row">
        <div className="relative hidden w-full md:flex">
          <Terminal className="absolute" title="index.ts">
            <pre className="overflow-x-hidden">
              {"" +
                "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                " <title>My AgentGPT Website</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <h1>Welcome to AgentGPT!</h1>\n" +
                "  <p>Explore the power of autonomous AI agents.</p>\n" +
                '  <script src="https://agentgpt.reworkd.ai/agentgpt.js"></script>\n' +
                "  <script>\n" +
                "    // Connect to AgentGPT API\n" +
                "    const agent = new AgentGPT();\n" +
                "    agent.connect('YOUR_API_KEY');\n" +
                "    \n" +
                "    // Example code to interact with AgentGPT\n" +
                "    agent.createAgent('MyAIAssistant');\n" +
                "    agent.setGoal('Sort my emails');\n" +
                "    agent.start();\n" +
                "  </script>\n" +
                "</body>\n" +
                "</html>\n"}
            </pre>
          </Terminal>
          <Terminal className="absolute left-16 top-20 z-10" title="agent_service.py">
            <pre className="overflow-x-hidden">
              {"import requests\n" +
                "\n" +
                "# Define the API endpoint\n" +
                'url = "https://api.agentgpt.example.com"\n' +
                "\n" +
                "# Make a GET request to retrieve data from the API\n" +
                "response = requests.get(url)\n" +
                "\n" +
                "# Process the response data\n" +
                "if response.status_code == 200:\n" +
                "    data = response.json()\n" +
                "    # Perform further actions with the data\n" +
                "    print(data)\n" +
                "else:\n" +
                '    print("Error: Unable to fetch data from the API")\n'}
            </pre>
          </Terminal>
        </div>
        <div className="mt-28 w-full">
          <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-neutral-900 bg-gradient-to-bl from-neutral-800  to-transparent p-2 pr-4">
            <FaGithub size={32} />
            <div>
              24.4 k<span className="text-gray-400"> stars</span>
            </div>
          </div>
          <h3 className="my-4 text-6xl font-medium tracking-tight">Proudly Open Source</h3>
          <p className="mb-8 font-extralight leading-7 text-gray-400">
            We think the power of AI should be available to everyone and should be driven by
            community. This is why we are proudly open source. We&apos;d love to hear your feedback
            at every step of the journey.
          </p>
          <div className="mt-6 flex flex-row gap-4">
            <a href="https://github.com/reworkd" target="_blank">
              <PrimaryButton>View on Github</PrimaryButton>
            </a>
            <a href="https://github.com/orgs/reworkd/projects/3" target="_blank">
              <PrimaryButton>Public Roadmap</PrimaryButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Terminal = (props: TerminalProps) => {
  return (
    <div
      className={clsx("w-3/4 max-w-md rounded-xl bg-neutral-800 drop-shadow-2xl", props.className)}
    >
      <MacWindowInternal>{props.title}</MacWindowInternal>
      <div className="h-72 overflow-hidden rounded-b-xl bg-neutral-900 p-4 text-[8pt] text-gray-400">
        {props.children}
      </div>
    </div>
  );
};

export default OpenSource;
