import {type NextPage} from "next";
import Badge from "../components/Badge";
import {useState} from "react";
import DefaultLayout from "../layout/default";
import React from "react";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";

const Home: NextPage = () => {
  const input = useState("")
  const [loading, setLoading] = React.useState<boolean>(false);
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [goal, setGoal] = React.useState<string>("");


  const handleNewGoal = async () => {
    setLoading(true)
    setGoal(goalInput);
    setMessages([...messages, goalInput]);
    const res = await axios.post("http://localhost:3000/api/chain?prompt=test", { prompt: goalInput })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const tasks: string[] = JSON.parse(res.data.tasks)
    setMessages((prev) => [...prev, ...tasks]);
    setLoading(false)
  }

  return (
    <DefaultLayout>
        <div id="title" className="flex gap-4 items-center">
          <div className="font-bold text-4xl text-[#C0C0C0]">AgentGPT</div>
          <Badge>Beta 🚀</Badge>
        </div>

        <ChatWindow>
          {messages.map((message, index) => <div key={`${index}-${message}`}>{message}</div>)}
          { loading ? <div>LOADING...</div> : null}
        </ChatWindow>

        <input type="text" value={goalInput} onChange={e => setGoalInput(e.target.value)}></input>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button onClick={handleNewGoal}>Send</button>
    </DefaultLayout>
  );
};

export default Home;