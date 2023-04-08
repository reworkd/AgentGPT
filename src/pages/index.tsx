import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import React from "react";
import ChatWindow, { ChatMessage } from "../components/ChatWindow";
import axios from "axios";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";

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
  const [name, setName] = React.useState<string>("");
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
          className="flex h-screen w-full items-center justify-center"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-lg flex-col items-center justify-center gap-3 py-10"
          >
            <div
              id="title"
              className="flex flex-col items-center font-mono shadow-2xl"
            >
              <div className="flex items-center">
                <span className="text-6xl font-bold text-[#C0C0C0]">Agent</span>
                <span className="mr-5 text-6xl font-bold text-white">GPT</span>
                <Badge>Beta 🚀</Badge>
              </div>
              <div className="font-mono text-[0.8em] font-bold text-white">
                Autonomous AI Agents in your browser
              </div>
            </div>

            <ChatWindow className="m-10">
              {messages.map((message, index) => (
                <ChatMessage
                  key={`${index}-${message.type}`}
                  message={message}
                />
              ))}
              {loading ? <div>LOADING...</div> : null}
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
