import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { type GetStaticProps, type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import ChatWindow from "../components/console/ChatWindow";
import Drawer from "../components/drawer/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaCog, FaPlay, FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/motions/popin";
import { VscLoading } from "react-icons/vsc";
import AutonomousAgent from "../services/agent/autonomous-agent";
import Expand from "../components/motions/expand";
import HelpDialog from "../components/dialog/HelpDialog";
import { SettingsDialog } from "../components/dialog/SettingsDialog";
import { TaskWindow } from "../components/TaskWindow";
import { useAuth } from "../hooks/useAuth";
import type { AgentPlaybackControl, Message } from "../types/agentTypes";
import { AGENT_PLAY, isTask } from "../types/agentTypes";
import { useAgent } from "../hooks/useAgent";
import { isEmptyOrBlank } from "../utils/whitespace";
import { resetAllMessageSlices, useAgentStore, useMessageStore } from "../stores";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSettings } from "../hooks/useSettings";
import { findLanguage, languages } from "../utils/languages";
import nextI18NextConfig from "../../next-i18next.config.js";
import { SignInDialog } from "../components/dialog/SignInDialog";
import { env } from "../env/client.mjs";
import { ToolsDialog } from "../components/dialog/ToolsDialog";

const Home: NextPage = () => {
  const { i18n } = useTranslation();
  // Zustand states with state dependencies
  const addMessage = useMessageStore.use.addMessage();
  const messages = useMessageStore.use.messages();
  const updateTaskStatus = useMessageStore.use.updateTaskStatus();

  const setAgent = useAgentStore.use.setAgent();
  const isAgentStopped = useAgentStore.use.isAgentStopped();
  const isAgentPaused = useAgentStore.use.isAgentPaused();
  const updateIsAgentPaused = useAgentStore.use.updateIsAgentPaused();
  const updateIsAgentStopped = useAgentStore.use.updateIsAgentStopped();
  const agentMode = useAgentStore.use.agentMode();
  const agent = useAgentStore.use.agent();

  const { session, status } = useAuth();
  const [nameInput, setNameInput] = React.useState<string>("");
  const [goalInput, setGoalInput] = React.useState<string>("");
  const [mobileVisibleWindow, setMobileVisibleWindow] = React.useState<"Chat" | "Tasks">("Chat");
  const settingsModel = useSettings();

  const [showHelpDialog, setShowHelpDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [showSignInDialog, setShowSignInDialog] = React.useState(false);
  const [showToolsDialog, setShowToolsDialog] = React.useState(false);
  const [hasSaved, setHasSaved] = React.useState(false);
  const agentUtils = useAgent();

  useEffect(() => {
    const key = "agentgpt-modal-opened-v0.2";
    const savedModalData = localStorage.getItem(key);

    setTimeout(() => {
      if (savedModalData == null) {
        setShowHelpDialog(true);
      }
    }, 1800);

    localStorage.setItem(key, JSON.stringify(true));
  }, []);

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef?.current?.focus();
  }, []);

  useEffect(() => {
    updateIsAgentStopped();
  }, [agent, updateIsAgentStopped]);

  const setAgentRun = (newName: string, newGoal: string) => {
    if (agent != null) {
      return;
    }

    setNameInput(newName);
    setGoalInput(newGoal);
    handleNewGoal(newName, newGoal);
  };

  const handleAddMessage = (message: Message) => {
    if (isTask(message)) {
      updateTaskStatus(message);
    }

    addMessage(message);
  };

  const handlePause = (opts: { agentPlaybackControl?: AgentPlaybackControl }) => {
    if (opts.agentPlaybackControl !== undefined) {
      updateIsAgentPaused(opts.agentPlaybackControl);
    }
  };

  const disableDeployAgent =
    agent != null || isEmptyOrBlank(nameInput) || isEmptyOrBlank(goalInput);

  const handleNewGoal = (name: string, goal: string) => {
    if (name.trim() === "" || goal.trim() === "") {
      return;
    }

    // Do not force login locally for people that don't have auth setup
    if (session === null && env.NEXT_PUBLIC_FORCE_AUTH) {
      setShowSignInDialog(true);
      return;
    }

    const newAgent = new AutonomousAgent(
      name.trim(),
      goal.trim(),
      handleAddMessage,
      handlePause,
      () => setAgent(null),
      {
        language: findLanguage(i18n.language).name,
        ...settingsModel.settings,
      },
      agentMode,
      session ?? undefined
    );
    setAgent(newAgent);
    setHasSaved(false);
    resetAllMessageSlices();
    newAgent?.run().then(console.log).catch(console.error);
  };

  const handleContinue = () => {
    if (!agent) {
      return;
    }

    agent.updatePlayBackControl(AGENT_PLAY);
    updateIsAgentPaused(agent.playbackControl);
    agent.updateIsRunning(true);
    agent.run().then(console.log).catch(console.error);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Only Enter is pressed, execute the function
    if (e.key === "Enter" && !disableDeployAgent && !e.shiftKey) {
      if (isAgentPaused) {
        handleContinue();
      }
      handleNewGoal(nameInput, goalInput);
    }
  };

  const handleStopAgent = () => {
    agent?.stopAgent();
    updateIsAgentStopped();
  };

  const handleVisibleWindowClick = (visibleWindow: "Chat" | "Tasks") => {
    // This controls whether the ChatWindow or TaskWindow is visible on mobile
    setMobileVisibleWindow(visibleWindow);
  };

  const shouldShowSave =
    status === "authenticated" && isAgentStopped && messages.length && !hasSaved;

  const firstButton =
    isAgentPaused && !isAgentStopped ? (
      <Button ping disabled={!isAgentPaused} onClick={handleContinue}>
        <FaPlay size={20} />
        <span className="ml-2">{i18n.t("CONTINUE", { ns: "common" })}</span>
      </Button>
    ) : (
      <Button
        ping={!disableDeployAgent}
        disabled={disableDeployAgent}
        onClick={() => handleNewGoal(nameInput, goalInput)}
      >
        {agent == null ? (
          i18n.t("BUTTON_DEPLOY_AGENT", { ns: "indexPage" })
        ) : (
          <>
            <VscLoading className="animate-spin" size={20} />
            <span className="ml-2">{i18n.t("RUNNING", { ns: "common" })}</span>
          </>
        )}
      </Button>
    );

  return (
    <DefaultLayout>
      <HelpDialog show={showHelpDialog} close={() => setShowHelpDialog(false)} />
      <ToolsDialog show={showToolsDialog} close={() => setShowToolsDialog(false)} />
      <SettingsDialog
        customSettings={settingsModel}
        show={showSettingsDialog}
        close={() => setShowSettingsDialog(false)}
      />
      <SignInDialog show={showSignInDialog} close={() => setShowSignInDialog(false)} />
      <main className="flex min-h-screen flex-row">
        <Drawer
          showHelp={() => setShowHelpDialog(true)}
          showSettings={() => setShowSettingsDialog(true)}
        />
        <div
          id="content"
          className="z-10 flex min-h-screen w-full items-center justify-center p-2 sm:px-4 md:px-10"
        >
          <div
            id="layout"
            className="flex h-full w-full max-w-screen-xl flex-col items-center justify-between gap-1 py-2 sm:gap-3 sm:py-5 md:justify-center"
          >
            <div id="title" className="relative flex flex-col items-center font-mono">
              <div className="flex flex-row items-start shadow-2xl">
                <span className="text-4xl font-bold text-[#C0C0C0] xs:text-5xl sm:text-6xl">
                  Agent
                </span>
                <span className="text-4xl font-bold text-white xs:text-5xl sm:text-6xl">GPT</span>
                <PopIn delay={0.5}>
                  <Badge colorClass="bg-gradient-to-t from-sky-500 to-sky-600 border-2 border-white/20">
                    {`${i18n?.t("BETA", {
                      ns: "indexPage",
                    })}`}{" "}
                    🚀
                  </Badge>
                </PopIn>
              </div>
              <div className="mt-1 text-center font-mono text-[0.7em] font-bold text-white">
                <p>
                  {i18n.t("HEADING_DESCRIPTION", {
                    ns: "indexPage",
                  })}
                </p>
              </div>
            </div>

            <div>
              <Button
                className="rounded-r-none py-0 text-sm sm:py-[0.25em] xl:hidden"
                disabled={mobileVisibleWindow == "Chat"}
                onClick={() => handleVisibleWindowClick("Chat")}
              >
                Chat
              </Button>
              <Button
                className="rounded-l-none py-0 text-sm sm:py-[0.25em] xl:hidden"
                disabled={mobileVisibleWindow == "Tasks"}
                onClick={() => handleVisibleWindowClick("Tasks")}
              >
                Tasks
              </Button>
            </div>
            <Expand className="flex w-full flex-row">
              <ChatWindow
                messages={messages}
                title="AgentGPT"
                onSave={
                  shouldShowSave
                    ? (format) => {
                        setHasSaved(true);
                        agentUtils.saveAgent({
                          goal: goalInput.trim(),
                          name: nameInput.trim(),
                          tasks: messages,
                        });
                      }
                    : undefined
                }
                scrollToBottom
                displaySettings
                setAgentRun={setAgentRun}
                visibleOnMobile={mobileVisibleWindow === "Chat"}
              />
              <TaskWindow visibleOnMobile={mobileVisibleWindow === "Tasks"} />
            </Expand>

            <div className="flex w-full flex-col gap-2 md:m-4">
              <Expand delay={1.2} className="flex flex-row items-end gap-2 md:items-center">
                <Input
                  inputRef={nameInputRef}
                  left={
                    <>
                      <FaRobot />
                      <span className="ml-2">{`${i18n?.t("AGENT_NAME", {
                        ns: "indexPage",
                      })}`}</span>
                    </>
                  }
                  value={nameInput}
                  disabled={agent != null}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  placeholder="AgentGPT"
                  type="text"
                />
                <Button ping onClick={() => setShowToolsDialog(true)} className="h-fit">
                  <p className="mr-3">Tools</p>
                  <FaCog />
                </Button>
              </Expand>
              <Expand delay={1.3}>
                <Input
                  left={
                    <>
                      <FaStar />
                      <span className="ml-2">{`${i18n?.t("LABEL_AGENT_GOAL", {
                        ns: "indexPage",
                      })}`}</span>
                    </>
                  }
                  disabled={agent != null}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  placeholder={`${i18n?.t("PLACEHOLDER_AGENT_GOAL", {
                    ns: "indexPage",
                  })}`}
                  type="textarea"
                />
              </Expand>
            </div>
            <Expand delay={1.4} className="flex gap-2">
              {firstButton}
              <Button
                disabled={agent === null}
                onClick={handleStopAgent}
                enabledClassName={"bg-red-600 hover:bg-red-400"}
              >
                {!isAgentStopped && agent === null ? (
                  <>
                    <VscLoading className="animate-spin" size={20} />
                    <span className="ml-2">{`${i18n?.t("BUTTON_STOPPING", {
                      ns: "indexPage",
                    })}`}</span>
                  </>
                ) : (
                  `${i18n?.t("BUTTON_STOP_AGENT", "BUTTON_STOP_AGENT", {
                    ns: "indexPage",
                  })}`
                )}
              </Button>
            </Expand>
          </div>
        </div>
      </main>
    </DefaultLayout>
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
