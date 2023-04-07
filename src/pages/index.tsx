import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import ChatWindow, { ChatMessage } from "../components/ChatWindow";
import axios from "axios";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";

export interface Message {
  type: "goal" | "thinking" | "task" | "action";
  value: string;
}

const GoalMessage = (goal: string) => {
  return { type: "goal", value: goal } as Message;
};

const TaskMessage = (task: string) => {
  return { type: "task", value: task } as Message;
};

const Home: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [goal, setGoal] = React.useState<string>("");

  const handleNewGoal = async () => {
    setLoading(true);
    setGoal(goalInput);
    setMessages([...messages, GoalMessage(goalInput)]);

    const res = await axios.post(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chain?prompt=test`,
      { prompt: goalInput }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const tasks: string[] = JSON.parse(res.data.tasks);
    setMessages((prev) => [...prev, ...tasks.map(TaskMessage)]);
    setLoading(false);
  };

  return (
    <DefaultLayout>
      <main className="flex h-screen w-screen flex-row ">
        <Drawer />
        <div
          id="content"
          className="flex h-screen w-full flex-col items-center justify-center gap-10"
        >
          <div id="title" className="flex items-center gap-4">
            <div className="font-mono text-6xl font-bold text-[#C0C0C0]">
              AgentGPT
            </div>
            <Badge>Beta 🚀</Badge>
          </div>

          <ChatWindow>
            {messages.map((message, index) => (
              <ChatMessage key={`${index}-${message.type}`} message={message} />
            ))}
            {loading ? <div>LOADING...</div> : null}
          </ChatWindow>

          <Input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button
            onClick={() => void handleNewGoal()}
            className="font-bolder text-gray/50 rounded-lg bg-[#1E88E5]/70 px-10 py-5 font-bold text-black/60 hover:bg-[#0084f7] hover:text-white"
          >
            Deploy Agent
          </Button>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
