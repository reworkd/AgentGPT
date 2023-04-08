import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import type { Message } from "../components/ChatWindow";
import ChatWindow, {
  CreateGoalMessage,
  CreateTaskMessage,
} from "../components/ChatWindow";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/motions/popin";
import { VscLoading } from "react-icons/vsc";
import type AutonomousAgent from "../components/AutonomousAgent";
import Expand from "../components/motions/expand";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const [name, setName] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [agent, setAgent] = React.useState<AutonomousAgent | null>(null);

  const [messages, setMessages] = React.useState<Message[]>([]);
  const startAgent = api.chain.startAgent.useMutation();

  const handleNewGoal = async () => {
    setMessages([...messages, CreateGoalMessage(goalInput)]);
    const { tasks } = await startAgent.mutateAsync({ prompt: goalInput });
    setMessages((prev) => [...prev, ...tasks.map(CreateTaskMessage)]);
  };

  return (
    <DefaultLayout>
      <main className="flex h-screen w-screen flex-row ">
        <Drawer />
        <div
          id="content"
          className="flex h-screen w-full items-center justify-center p-2 px-4"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-lg flex-col items-center justify-between gap-3 py-5 md:justify-center"
          >
            <div
              id="title"
              className="relative flex flex-col items-center font-mono"
            >
              <div className="flex flex-row items-start shadow-2xl">
                <span className="text-6xl font-bold text-[#C0C0C0]">Agent</span>
                <span className="text-6xl font-bold text-white">GPT</span>
                <PopIn delay={0.5}>
                  <Badge>Beta 🚀</Badge>
                </PopIn>
              </div>
              <div className="mt-1 text-center font-mono text-[0.7em] font-bold text-white">
                Assemble, configure, and deploy autonomous AI Agents in your
                browser.
              </div>
            </div>

            <Expand className="w-full">
              <ChatWindow className="mt-4" messages={messages} />
            </Expand>

            <div className="mt-10 flex w-full flex-col gap-2">
              <Input
                left={
                  <>
                    <FaRobot />
                    <span className="ml-2">Name:</span>
                  </>
                }
                value={name}
                disabled={agent != null}
                onChange={(e) => setName(e.target.value)}
                placeholder="AgentGPT (Note: this field doesn't do anything right now)"
              />

              <Input
                left={
                  <>
                    <FaStar />
                    <span className="ml-2">Goal:</span>
                  </>
                }
                disabled={agent != null}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Make the world a better place."
              />
            </div>

            <Button
              disabled={agent != null || name === "" || goalInput === ""}
              onClick={handleNewGoal}
              className="mt-10"
            >
              {agent == null ? (
                "Deploy Agent"
              ) : (
                <>
                  <VscLoading className="animate-spin" size={20} />
                  <span className="ml-2">Agent running</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
