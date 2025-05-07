import clsx from "clsx";
import React from "react";
import { FaPause, FaPlay, FaStop, FaUndo, FaTrash } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

import type { AgentLifecycle } from "../../services/agent/agent-run-model";
import Button from "../Button";
import { AgentApi } from "../../services/agent/agent-api";

type AgentControlsProps = {
  disablePlay: boolean;
  lifecycle: AgentLifecycle;
  handlePlay: () => void;
  handlePause: () => void;
  handleStop: () => void;
  agentApi: AgentApi;
};

const AgentControls = ({
  lifecycle,
  disablePlay,
  handlePlay,
  handlePause,
  handleStop,
  agentApi,
}: AgentControlsProps) => {
  const handleDelete = async () => {
    await agentApi.deleteAgent();
  };

  return (
    <div className="flex gap-2">
      <Button ping={!disablePlay} disabled={disablePlay} onClick={handlePlay}>
        {lifecycle === "running" && <ImSpinner2 className="animate-spin" />}
        {lifecycle === "stopped" && <FaUndo />}
        {!["running", "stopped"].includes(lifecycle || "") && <FaPlay />}
      </Button>
      <Button
        disabled={lifecycle !== "running"}
        onClick={handlePause}
        enabledClassName={clsx("bg-yellow-600 hover:bg-yellow-400")}
      >
        {lifecycle === "pausing" ? <ImSpinner2 className="animate-spin" /> : <FaPause />}
      </Button>
      <Button
        disabled={lifecycle === "offline" || lifecycle == "stopped"}
        onClick={handleStop}
        enabledClassName={clsx("bg-red-600 hover:bg-red-400")}
      >
        <FaStop />
      </Button>
      <Button
        disabled={lifecycle === "offline" || lifecycle == "stopped"}
        onClick={handleDelete}
        enabledClassName={clsx("bg-red-600 hover:bg-red-400")}
      >
        <FaTrash />
      </Button>
    </div>
  );
};

export default AgentControls;
