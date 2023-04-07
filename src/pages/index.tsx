import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import Drawer from "../components/Drawer";
import Input from "../components/Input";

const Home: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [goal, setGoal] = React.useState<string>("");

  const handleNewGoal = async () => {
    setLoading(true);
    setGoal(goalInput);
    setMessages([...messages, goalInput]);

    const res = await axios.post(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chain?prompt=test`,
      { prompt: goalInput }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const tasks: string[] = JSON.parse(res.data.tasks);
    setMessages((prev) => [...prev, ...tasks]);
    setLoading(false);
  };

  return (
    <DefaultLayout>
      <main className="flex h-screen w-screen flex-row ">
        <Drawer />
        <div
          id="content"
          className="flex h-screen w-full flex-col items-center justify-center"
        >
          <div id="title" className="flex items-center gap-4">
            <div className="text-4xl font-bold text-[#C0C0C0]">AgentGPT</div>
            <Badge>Beta 🚀</Badge>
          </div>

          <ChatWindow>
            {messages.map((message, index) => (
              <div key={`${index}-${message}`}>{message}</div>
            ))}
            {loading ? <div>LOADING...</div> : null}
          </ChatWindow>

          <Input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button
            onClick={() => void handleNewGoal()}
            className="w-64 rounded-full bg-gray-300"
          >
            Deploy Agent
          </button>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
