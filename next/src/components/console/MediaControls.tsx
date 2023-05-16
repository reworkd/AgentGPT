import { FaPause, FaPlay, FaRedo, FaStepForward, FaStop } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import type { AgentStatus } from "../../types/agentTypes";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../loader";

interface MediaControlsProps {
  status: AgentStatus;
  onStepForward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const MediaControls = ({ status, ...props }: MediaControlsProps) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Effect", status);
    if (status != "running") setLoading(false);
  }, [status, setLoading]);

  const isPaused = status === "paused";
  const isStopped = status === "stopped";

  const icon = isPaused || isStopped ? FaPlay : FaPause;
  const stopOrRestartIcon = isStopped ? FaRedo : FaStop;

  return (
    <AnimatePresence>
      <div
        className={clsx(
          "absolute -bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-row items-center justify-center align-middle",
          loading && "cursor-not-allowed border-white/10 text-white/30"
        )}
      >
        {status != "stopped" && (
          <motion.button
            className="flex w-10 translate-x-2 flex-row justify-center rounded-l-full border-2 border-white/50 bg-red-500 py-2 transition-all hover:border-white/25 hover:bg-red-400"
            initial={{ x: 40, y: 0, opacity: 0 }}
            exit={{ x: 40, y: 0 }}
            animate={{ x: 8, y: 0, opacity: 1 }}
            transition={{
              duration: 0.25,
              delay: 0.25,
            }}
          >
            {stopOrRestartIcon({
              className: "h-4 w-4",
              onClick: () => {
                props.onStop?.();
              },
            })}
          </motion.button>
        )}
        <motion.button
          className={clsx(
            isPaused && "bg-green-500 hover:bg-green-600",
            isPaused || "bg-blue-500 hover:bg-blue-600",
            "z-50 rounded-full border-2 border-white/75 p-3 transition-all hover:border-white/25"
          )}
          onClick={() => {
            if (isPaused || isStopped) {
              props.onPlay();
            } else {
              props.onPause();
              setLoading(true);
            }
          }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.25,
            delay: 0,
          }}
        >
          {loading ? (
            <Loader size={24} />
          ) : (
            icon({
              className: clsx("h-6 w-6", isPaused && "translate-x-0.5"),
            })
          )}
        </motion.button>
        {status != "stopped" && (
          <motion.button
            className="flex w-10 -translate-x-2 flex-row justify-center rounded-r-full border-2 border-white/50 bg-amber-500 py-2 transition-all hover:border-white/25 hover:bg-amber-400"
            initial={{ x: -40, y: 0, opacity: 0 }}
            exit={{ x: -40, y: 0 }}
            animate={{ x: -8, y: 0, opacity: 1 }}
            transition={{
              duration: 0.25,
              delay: 0.25,
            }}
            onClick={() => {
              props.onStepForward();
              setLoading(true);
            }}
          >
            <FaStepForward className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
};
