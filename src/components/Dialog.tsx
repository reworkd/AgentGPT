import React from "react";
import Button from "./Button";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Dialog({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <>
      {showModal ? (
        <>
          <div
            className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 p-3 font-mono text-white outline-none transition-all transition-all focus:outline-none"
            onClick={() => setShowModal(false)}
          >
            <div className="relative mx-auto my-6 w-auto max-w-3xl rounded-lg border-2 border-zinc-600">
              {/*content*/}
              <div className="relative z-50 flex w-full flex-col rounded-lg border-0 bg-[#3a3a3a] shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b-2 border-solid border-white/20 p-5">
                  <h3 className="font-mono text-3xl font-semibold">
                    Welcome to AgentGPT 🤖
                  </h3>
                  <button className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none opacity-5 outline-none focus:outline-none">
                    <span className="block h-6 w-6 bg-transparent text-2xl opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="text-md relative my-3 flex-auto p-3 leading-relaxed">
                  <p>
                    <strong>AgentGPT</strong> allows you to configure and deploy
                    Autonomous AI agents. Name your own custom AI and have it
                    embark on any goal imaginable. It will attempt to reach the
                    goal by thinking of tasks to do, executing them, and
                    learning from the results 🚀.
                  </p>
                  <div>
                    <br />
                    This platform is currently in beta, we are currently working
                    on:
                    <ul className="ml-5 list-inside list-disc">
                      <li>Long term memory 🧠</li>
                      <li>Web browsing 🌐</li>
                      <li>Interaction with websites and people 👨‍👩‍👦</li>
                    </ul>
                    <p className="mt-2">Follow the journey below:</p>
                  </div>
                  <div className="mt-4 flex w-full items-center justify-center gap-5">
                    <div
                      className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
                      onClick={() =>
                        window.open(
                          "https://twitter.com/asimdotshrestha",
                          "_blank"
                        )
                      }
                    >
                      <FaTwitter size={30} />
                    </div>
                    <div
                      className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
                      onClick={() =>
                        window.open(
                          "https://github.com/reworkd/AgentGPT",
                          "_blank"
                        )
                      }
                    >
                      <FaGithub size={30} />
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t-2 border-solid border-white/20 p-2">
                  <Button onClick={() => setShowModal(false)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
