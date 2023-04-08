import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import type { Message } from "../components/ChatWindow";
import ChatWindow, {
  CreateGoalMessage,
  CreateTaskMessage,
} from "../components/ChatWindow";
import axios from "axios";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/popin";
import { VscLoading } from "react-icons/vsc";
import type AutonomousAgent from "../components/AutonomousAgent";

const Home: NextPage = () => {
  const [name, setName] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [agent, setAgent] = React.useState<AutonomousAgent | null>(null);

  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleNewGoal = async () => {
    setMessages([...messages, CreateGoalMessage(goalInput)]);

    const res = await axios.post(`/api/chain`, { prompt: goalInput });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const tasks: string[] = JSON.parse(res.data.tasks);
    setMessages((prev) => [...prev, ...tasks.map(CreateTaskMessage)]);
  };

  return (
    <DefaultLayout>
      <main className="flex h-screen w-screen flex-row ">
        <Drawer />
        <div
          id="content"
          className="flex h-screen w-full items-center justify-center p-2"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-lg flex-col items-center gap-3 py-10 md:justify-center"
          >
            <div
              id="title"
              className="relative flex flex-col items-center font-mono"
            >
              <div className="flex flex-row items-center shadow-2xl">
                <span className="text-6xl font-bold text-[#C0C0C0]">Agent</span>
                <span className="mr-5 text-6xl font-bold text-white">GPT</span>
                <span className="absolute right-10 top-0 block hidden md:flex">
                  <PopIn delay={0.5}>
                    <Badge>Beta 🚀</Badge>
                  </PopIn>
                </span>
              </div>
              <div className="mt-1 font-mono text-[0.8em] font-bold text-white">
                Assemble, configure, and deploy autonomous AI Agents in your
                browser.
              </div>
            </div>

            <ChatWindow className="mt-4" messages={messages} />

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

            <Button
              disabled={agent != null || name === "" || goalInput === ""}
              onClick={() => void handleNewGoal()}
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
