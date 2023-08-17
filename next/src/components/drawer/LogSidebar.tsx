import type { Session } from "next-auth";
import type { FC } from "react";
import { useState } from "react";
import { FaBars, FaFolder } from "react-icons/fa";

import { SidebarTransition } from "./Sidebar";
import type { LogType } from "../../hooks/useWorkflow";
import { useWorkflow } from "../../hooks/useWorkflow";
import { useConfigStore } from "../../stores/configStore";
import MarkdownRenderer from "../console/MarkdownRenderer";

type LogSidebarProps = {
  workflowId?: string;
  session: Session | null;
  organizationId?: string;
};

const LogSidebar: FC<LogSidebarProps> = ({ workflowId, session, organizationId }) => {
  const { layout, setLayout } = useConfigStore();

  const [logMessage, setLogMessage] = useState<LogType[]>([]);

  const setShow = (show: boolean) => {
    setLayout({ showLogSidebar: show });
  };

  useWorkflow(workflowId, session, organizationId, (log) =>
    setLogMessage((prev) => [...prev, log])
  );

  const handleExportToTxt = () => {
    if (workflowId === undefined) {
      return;
    }
    const logString = logMessage.map(({ date, msg }) => `${date} - ${msg}`).join("\n\n");
    const blob = new Blob([logString], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `logMessages_${workflowId}.txt`;
    document.body.appendChild(link).click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarTransition
      show={layout.showLogSidebar}
      side="right"
      className="mr-3.5 w-full rounded-lg bg-white p-6 shadow-xl shadow-stone-400"
    >
      <div className="text-color-primary flex h-[80vh] flex-col gap-2 overflow-x-hidden break-words bg-white">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(false)}
          >
            <FaBars size="15" className="z-20 mr-2 text-black" />
          </button>
          <div />
        </div>
        <div className="mb-1 flex items-center gap-2 px-4 pt-4 text-xl font-bold text-black">
          <FaFolder />
          <span>Workflow logs</span>
        </div>
        <hr />
        <div className="max-h-[70vh] overflow-y-auto font-inter text-black">
          {logMessage.length === 0 && (
            <p className="px-4 text-sm font-thin">
              When you execute a workflow, log messages will appear here
            </p>
          )}
          {logMessage.map(({ date, msg }, i) => (
            <>
              <div key={i} className="p-0 px-2 pt-1 text-xs">
                <span className="text-gray-400">{date} </span>
                <MarkdownRenderer className="ml-4">{msg}</MarkdownRenderer>
              </div>
              <hr />
            </>
          ))}
        </div>
        <div className="mb-5 flex items-center gap-2 px-4 pt-6 text-sm">
          {logMessage.length > 0 && (
            <button
              onClick={handleExportToTxt}
              className="ml-auto rounded bg-black px-4 py-1 text-white"
            >
              Export logs
            </button>
          )}
        </div>
      </div>
    </SidebarTransition>
  );
};
export default LogSidebar;
