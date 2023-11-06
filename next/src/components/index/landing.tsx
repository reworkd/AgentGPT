import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import type { KeyboardEvent, RefObject } from "react";
import { useState } from "react";
import { FaCog, FaPlay, FaStar } from "react-icons/fa";

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
  handlePlay: () => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  goalInputRef: RefObject<HTMLInputElement>;
  goalInput: string;
  setGoalInput: (string) => void;
  setShowSignInDialog: (boolean) => void;
  setAgentRun: (newName: string, newGoal: string) => void;
};
const Landing = (props: LandingProps) => {
  const [showToolsDialog, setShowToolsDialog] = useState(false);

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
      <div className="absolute left-0 right-0 m-auto grid place-items-center overflow-hidden opacity-40">
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
        className="z-10 flex w-full flex-col gap-6"
      >
        <Input
          inputRef={props.goalInputRef}
          left={
            <>
              <FaStar />
              <span className="ml-2">{`${t("LABEL_AGENT_GOAL")}`}</span>
            </>
          }
          disabled={agent != null}
          value={props.goalInput}
          onChange={(e) => props.setGoalInput(e.target.value)}
          onKeyDown={props.handleKeyPress}
          placeholder={`${t("PLACEHOLDER_AGENT_GOAL")}`}
          type="textarea"
        />

        <div className="flex w-full flex-row items-center justify-center gap-3">
          <Button
            ping
            onClick={() => setShowToolsDialog(true)}
            className="h-full bg-gradient-to-t from-slate-9 to-slate-12 hover:shadow-depth-3"
          >
            <FaCog />
          </Button>
          <Button
            onClick={props.handlePlay}
            className="border-0 bg-gradient-to-t from-[#02FCF1] to-[#A02BFE] subpixel-antialiased saturate-[75%] hover:saturate-100"
          >
            <FaPlay />
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default Landing;
