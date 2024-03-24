import { useTranslation } from "next-i18next";
import React from "react";

import { useSettings } from "../../hooks/useSettings";
import { useAgentStore } from "../../stores";
import { useTaskStore } from "../../stores/taskStore";
import type { Message } from "../../types/message";
import AgentControls from "../console/AgentControls";
import { ChatMessage } from "../console/ChatMessage";
import ChatWindow from "../console/ChatWindow";
import { ChatWindowTitle } from "../console/ChatWindowTitle";
import Summarize from "../console/SummarizeButton";
import FadeIn from "../motions/FadeIn";

type ChatProps = {
  messages: Message[];
  disableStartAgent: boolean;
  handlePlay: (name: string, goal: string) => void;
  nameInput: string;
  goalInput: string;
  setShowSignInDialog: (boolean) => void;
  setAgentRun: (newName: string, newGoal: string) => void;
};
const Chat = (props: ChatProps) => {
  const { settings } = useSettings();
  const { t } = useTranslation("indexPage");
  const [chatInput, setChatInput] = React.useState("");
  const agent = useAgentStore.use.agent();
  const agentLifecycle = useAgentStore.use.lifecycle();

  const tasks = useTaskStore.use.tasks();

  return (
    <>
      <div className="flex w-full flex-grow flex-col items-center overflow-hidden">
        <ChatWindow
          messages={props.messages}
          title={<ChatWindowTitle model={settings.customModelName} />}
          chatControls={
            agent
              ? {
                  value: chatInput,
                  onChange: (value: string) => {
                    setChatInput(value);
                  },
                  handleChat: async () => {
                    const currentInput = chatInput;
                    setChatInput("");
                    await agent?.chat(currentInput);
                  },
                  loading: tasks.length == 0 || chatInput === "",
                }
              : undefined
          }
        >
          {props.messages.map((message, index) => {
            return (
              <FadeIn key={`${index}-${message.type}`}>
                <ChatMessage message={message} />
              </FadeIn>
            );
          })}
          <Summarize />
        </ChatWindow>
      </div>
      <AgentControls
        disablePlay={props.disableStartAgent}
        lifecycle={agentLifecycle}
        handlePlay={() => props.handlePlay(props.nameInput, props.goalInput)}
        handlePause={() => agent?.pauseAgent()}
        handleStop={() => agent?.stopAgent()}
      />
    </>
  );
};

export default Chat;
