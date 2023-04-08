import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import type { Message } from "../components/ChatWindow";
import ChatWindow, {
  ChatMessage,
  CreateGoalMessage,
  CreateTaskMessage,
} from "../components/ChatWindow";
import axios from "axios";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/popin";

const Home: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [goal, setGoal] = React.useState<string>("");

  const handleNewGoal = async () => {
    setLoading(true);
    setGoal(goalInput);
    setMessages([...messages, CreateGoalMessage(goalInput)]);

    const res = await axios.post(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chain?prompt=test`,
      { prompt: goalInput }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const tasks: string[] = JSON.parse(res.data.tasks);
    setMessages((prev) => [...prev, ...tasks.map(CreateTaskMessage)]);
    setLoading(false);
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
              <div className="flex items-center shadow-2xl">
                <span className="text-6xl font-bold text-[#C0C0C0]">Agent</span>
                <span className="mr-5 text-6xl font-bold text-white">GPT</span>
                <span className="hidden md:flex">
                  <PopIn delay={0.5} className="absolute right-12 top-0 ">
                    <Badge>Beta 🚀</Badge>
                  </PopIn>
                </span>
              </div>
              <div className="mt-1 font-mono text-[0.8em] font-bold text-white">
                Assemble, configure, and deploy autonomous AI Agents in your
                browser.
              </div>
            </div>

            <ChatWindow messages={messages} className="mt-4">
              {loading ? (
                <ChatMessage
                  message={{ type: "action", value: "🧠 Thinking..." }}
                />
              ) : null}
            </ChatWindow>

            <Input
              left={
                <>
                  <FaRobot />
                  <span className="ml-2">Name:</span>
                </>
              }
              value={name}
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
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Make the world a better place."
            />

            <Button
              disabled={goalInput === ""}
              onClick={() => void handleNewGoal()}
              className="mt-10"
            >
              Deploy Agent
            </Button>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
