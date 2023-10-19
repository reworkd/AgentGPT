import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import React from "react";
import { FaCog, FaPlay, FaRobot, FaStar } from "react-icons/fa";

import { useAgentStore } from "../../stores";
import type { Message } from "../../types/message";
import AppTitle from "../AppTitle";
import Button from "../Button";
import ExampleAgents from "../console/ExampleAgents";
import { ToolsDialog } from "../dialog/ToolsDialog";
import Globe from "../Globe";
import Input from "../Input";

type LandingProps = {
  messages: Message[];
  disableStartAgent: boolean;
  handlePlay: (name: string, goal: string) => void;
  handleKeyPress: (
    e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  nameInput: string;
  nameInputRef: React.RefObject<HTMLInputElement>;
  setNameInput: (string) => void;
  goalInput: string;
  setGoalInput: (string) => void;
  setShowSignInDialog: (boolean) => void;
  setAgentRun: (newName: string, newGoal: string) => void;
};
const Landing = (props: LandingProps) => {
  const [showToolsDialog, setShowToolsDialog] = React.useState(false);

  const { t } = useTranslation("indexPage");
  const agent = useAgentStore.use.agent();

  return (
    <>
      <ToolsDialog show={showToolsDialog} setOpen={setShowToolsDialog} />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, type: "easeInOut" }}
        className="z-10"
      >
        <AppTitle />
      </motion.div>
      <div className="absolute left-0 right-0 m-auto grid place-items-center opacity-40">
        <Globe />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1, type: "easeInOut" }}
        className="z-10"
      >
        <ExampleAgents setAgentRun={props.setAgentRun} setShowSignIn={props.setShowSignInDialog} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5, type: "easeInOut" }}
        className="z-10 flex w-full flex-col gap-2"
      >
        <div className="flex w-full flex-row items-end gap-2 md:items-center">
          <Input
            inputRef={props.nameInputRef}
            left={
              <>
                <FaRobot />
                <span className="ml-2">{`${t("AGENT_NAME")}`}</span>
              </>
            }
            value={props.nameInput}
            disabled={agent != null}
            onChange={(e) => props.setNameInput(e.target.value)}
            onKeyDown={(e) => props.handleKeyPress(e)}
            placeholder="AgentGPT"
            type="text"
          />
          <Button
            ping
            onClick={() => setShowToolsDialog(true)}
            className="h-full bg-gradient-to-t from-amber-500 to-amber-600 transition-all hover:bg-gradient-to-t hover:from-amber-400 hover:to-amber-600"
          >
            <p className="mr-3">Tools</p>
            <FaCog />
          </Button>
        </div>
        <div className="flex w-full flex-row items-end gap-2 md:items-center">
          <Input
            left={
              <>
                <FaStar />
                <span className="ml-2">{`${t("LABEL_AGENT_GOAL")}`}</span>
              </>
            }
            disabled={agent != null}
            value={props.goalInput}
            onChange={(e) => props.setGoalInput(e.target.value)}
            onKeyDown={(e) => props.handleKeyPress(e)}
            placeholder={`${t("PLACEHOLDER_AGENT_GOAL")}`}
            type="textarea"
          />
          <Button
            onClick={() => props.handlePlay(props.nameInput, props.goalInput)}
            className="h-full"
          >
            <p className="mr-5">Play</p>
            <FaPlay />
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default Landing;
