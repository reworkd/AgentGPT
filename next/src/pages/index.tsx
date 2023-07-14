import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { type GetStaticProps, type NextPage } from "next";
import Button from "../components/Button";
import { FaCog, FaRobot, FaStar } from "react-icons/fa";
import AutonomousAgent from "../services/agent/autonomous-agent";
import HelpDialog from "../components/dialog/HelpDialog";
import { useAuth } from "../hooks/useAuth";
import { useAgent } from "../hooks/useAgent";
import { isEmptyOrBlank } from "../utils/whitespace";
import {
  resetAllAgentSlices,
  resetAllMessageSlices,
  useAgentStore,
  useMessageStore,
} from "../stores";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { languages } from "../utils/languages";
import nextI18NextConfig from "../../next-i18next.config.js";
import { SignInDialog } from "../components/dialog/SignInDialog";
import { ToolsDialog } from "../components/dialog/ToolsDialog";
import DashboardLayout from "../layout/dashboard";
import AppTitle from "../components/AppTitle";
import FadeIn from "../components/motions/FadeIn";
import Input from "../components/Input";
import Expand from "../components/motions/expand";
import ChatWindow from "../components/console/ChatWindow";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { useRouter } from "next/router";
import { useAgentInputStore } from "../stores/agentInputStore";
import { MessageService } from "../services/agent/message-service";
import { DefaultAgentRunModel } from "../services/agent/agent-run-model";
import { resetAllTaskSlices, useTaskStore } from "../stores/taskStore";
import { ChatWindowTitle } from "../components/console/ChatWindowTitle";
import { AgentApi } from "../services/agent/agent-api";
import { toApiModelSettings } from "../utils/interfaces";
import ExampleAgents from "../components/console/ExampleAgents";
import Summarize from "../components/console/SummarizeButton";
import AgentControls from "../components/console/AgentControls";
import { ChatMessage } from "../components/console/ChatMessage";
import clsx from "clsx";
import TaskSidebar from "../components/drawer/TaskSidebar";

const Home: NextPage = () => {
  const { t } = useTranslation("indexPage");
  const addMessage = useMessageStore.use.addMessage();
  const messages = useMessageStore.use.messages();
  const tasks = useTaskStore.use.tasks();
  const { query } = useRouter();

  const setAgent = useAgentStore.use.setAgent();
  const agentLifecycle = useAgentStore.use.lifecycle();

  const agent = useAgentStore.use.agent();

  const fullscreen = agent !== null;
  const { session } = useAuth();
  const nameInput = useAgentInputStore.use.nameInput();
  const setNameInput = useAgentInputStore.use.setNameInput();
  const goalInput = useAgentInputStore.use.goalInput();
  const setGoalInput = useAgentInputStore.use.setGoalInput();
  const [chatInput, setChatInput] = React.useState("");
  const { settings } = useSettings();

  const [showSignInDialog, setShowSignInDialog] = React.useState(false);
  const [showToolsDialog, setShowToolsDialog] = React.useState(false);
  const agentUtils = useAgent();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef?.current?.focus();
  }, []);

  const setAgentRun = (newName: string, newGoal: string) => {
    setNameInput(newName);
    setGoalInput(newGoal);
    handlePlay(newName, newGoal);
  };

  const disableStartAgent =
    (agent !== null && !["paused", "stopped"].includes(agentLifecycle)) ||
    isEmptyOrBlank(nameInput) ||
    isEmptyOrBlank(goalInput);

  const handlePlay = (name: string, goal: string) => {
    if (agentLifecycle === "stopped") handleRestart();
    else if (name.trim() === "" || goal.trim() === "") return;
    else handleNewAgent(name.trim(), goal.trim());
  };

  const handleNewAgent = (name: string, goal: string) => {
    if (session === null) {
      storeAgentDataInLocalStorage(name, goal);
      setShowSignInDialog(true);
      return;
    }

    if (agent && agentLifecycle == "paused") {
      agent?.run().catch(console.error);
      return;
    }

    const model = new DefaultAgentRunModel(name.trim(), goal.trim());
    const messageService = new MessageService(addMessage);
    const agentApi = new AgentApi({
      model_settings: toApiModelSettings(settings, session),
      name: name,
      goal: goal,
      session,
      agentUtils: agentUtils,
    });
    const newAgent = new AutonomousAgent(
      model,
      messageService,
      settings,
      agentApi,
      session ?? undefined
    );
    setAgent(newAgent);
    newAgent?.run().then(console.log).catch(console.error);
  };

  const storeAgentDataInLocalStorage = (name: string, goal: string) => {
    const agentData = { name, goal };
    localStorage.setItem("agentData", JSON.stringify(agentData));
  };

  const getAgentDataFromLocalStorage = () => {
    const agentData = localStorage.getItem("agentData");
    return agentData ? (JSON.parse(agentData) as { name: string; goal: string }) : null;
  };

  useEffect(() => {
    if (session !== null) {
      const agentData = getAgentDataFromLocalStorage();

      if (agentData) {
        setNameInput(agentData.name);
        setGoalInput(agentData.goal);
        localStorage.removeItem("agentData");
      }
    }
  }, [session]);

  const handleRestart = () => {
    resetAllMessageSlices();
    resetAllTaskSlices();
    resetAllAgentSlices();
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Only Enter is pressed, execute the function
    if (e.key === "Enter" && !disableStartAgent && !e.shiftKey) {
      handlePlay(nameInput, goalInput);
    }
  };

  return (
    <DashboardLayout rightSidebar={TaskSidebar}>
      <HelpDialog />
      <ToolsDialog show={showToolsDialog} close={() => setShowToolsDialog(false)} />

      <SignInDialog show={showSignInDialog} close={() => setShowSignInDialog(false)} />
      <div id="content" className="flex min-h-screen w-full items-center justify-center">
        <div
          id="layout"
          className={clsx(
            "flex h-screen w-full max-w-screen-xl flex-col items-center gap-1 p-2 pt-10 sm:gap-3 sm:p-4",
            agent !== null ? "pt-11" : "pt-3"
          )}
        >
          {
            <AnimatePresence>
              {!fullscreen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "fit-content" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, type: "easeInOut" }}
                >
                  <AppTitle />
                </motion.div>
              )}
            </AnimatePresence>
          }
          <Expand className="flex w-full flex-grow overflow-hidden">
            <ChatWindow
              messages={messages}
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
              {messages.length === 0 && <ExampleAgents setAgentRun={setAgentRun} />}
              {messages.map((message, index) => {
                return (
                  <FadeIn key={`${index}-${message.type}`}>
                    <ChatMessage message={message} />
                  </FadeIn>
                );
              })}
              <Summarize />
            </ChatWindow>
          </Expand>

          <FadeIn
            delay={0}
            initialY={30}
            duration={1}
            className="flex w-full flex-col items-center gap-2"
          >
            <AnimatePresence>
              {!fullscreen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "fit-content" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, type: "easeInOut" }}
                  className="flex w-full flex-col gap-2"
                >
                  <div className="flex w-full flex-row items-end gap-2 md:items-center">
                    <Input
                      inputRef={nameInputRef}
                      left={
                        <>
                          <FaRobot />
                          <span className="ml-2">{`${t("AGENT_NAME")}`}</span>
                        </>
                      }
                      value={nameInput}
                      disabled={agent != null}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e)}
                      placeholder="AgentGPT"
                      type="text"
                    />
                    <Button
                      ping
                      onClick={() => setShowToolsDialog(true)}
                      className="border-white/20 bg-gradient-to-t from-sky-500 to-sky-600 transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600"
                    >
                      <p className="mr-3">Tools</p>
                      <FaCog />
                    </Button>
                  </div>
                  <Input
                    left={
                      <>
                        <FaStar />
                        <span className="ml-2">{`${t("LABEL_AGENT_GOAL")}`}</span>
                      </>
                    }
                    disabled={agent != null}
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    placeholder={`${t("PLACEHOLDER_AGENT_GOAL")}`}
                    type="textarea"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AgentControls
              disablePlay={disableStartAgent}
              lifecycle={agentLifecycle}
              handlePlay={() => handlePlay(nameInput, goalInput)}
              handlePause={() => agent?.pauseAgent()}
              handleStop={() => agent?.stopAgent()}
            />
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
