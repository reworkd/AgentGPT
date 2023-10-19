import clsx from "clsx";
import { type GetStaticProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useRef } from "react";

import nextI18NextConfig from "../../next-i18next.config.js";
import HelpDialog from "../components/dialog/HelpDialog";
import { SignInDialog } from "../components/dialog/SignInDialog";
import TaskSidebar from "../components/drawer/TaskSidebar";
import Chat from "../components/index/chat";
import Landing from "../components/index/landing";
import { useAgent } from "../hooks/useAgent";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import DashboardLayout from "../layout/dashboard";
import { AgentApi } from "../services/agent/agent-api";
import { DefaultAgentRunModel } from "../services/agent/agent-run-model";
import AutonomousAgent from "../services/agent/autonomous-agent";
import { MessageService } from "../services/agent/message-service";
import {
  resetAllAgentSlices,
  resetAllMessageSlices,
  useAgentStore,
  useMessageStore,
} from "../stores";
import { useAgentInputStore } from "../stores/agentInputStore";
import { resetAllTaskSlices, useTaskStore } from "../stores/taskStore";
import { toApiModelSettings } from "../utils/interfaces";
import { languages } from "../utils/languages";
import { isEmptyOrBlank } from "../utils/whitespace";

const Home: NextPage = () => {
  const { t } = useTranslation("indexPage");
  const addMessage = useMessageStore.use.addMessage();
  const messages = useMessageStore.use.messages();
  const tasks = useTaskStore.use.tasks();

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
    <DashboardLayout rightSidebar={<TaskSidebar />}>
      <HelpDialog />

      <SignInDialog show={showSignInDialog} setOpen={setShowSignInDialog} />
      <div id="content" className="flex min-h-screen w-full items-center justify-center">
        <div
          id="layout"
          className={clsx(
            "relative flex h-screen w-full max-w-screen-md flex-col items-center justify-center gap-5 p-2 pt-10 sm:gap-3 sm:p-4"
          )}
        >
          {agent !== null ? (
            <Chat
              messages={messages}
              disableStartAgent={disableStartAgent}
              handlePlay={handlePlay}
              nameInput={nameInput}
              goalInput={goalInput}
              setShowSignInDialog={setShowSignInDialog}
              setAgentRun={setAgentRun}
            />
          ) : (
            <Landing
              messages={messages}
              disableStartAgent={disableStartAgent}
              handlePlay={handlePlay}
              handleKeyPress={handleKeyPress}
              nameInput={nameInput}
              nameInputRef={nameInputRef}
              setNameInput={setNameInput}
              goalInput={goalInput}
              setGoalInput={setGoalInput}
              setShowSignInDialog={setShowSignInDialog}
              setAgentRun={setAgentRun}
            />
          )}
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
