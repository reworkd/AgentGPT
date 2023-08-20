import React from "react";
import { FaCog } from "react-icons/fa";

import Dialog from "./Dialog";
import type { ActiveTool } from "../../hooks/useTools";
import { useTools } from "../../hooks/useTools";
import { Switch } from "../Switch";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import OauthApi from "../../services/workflow/oauthApi";
import Button from "../Button";

export const ToolsDialog: React.FC<{
  show: boolean;
  close: () => void;
}> = ({ show, close }) => {
  const { activeTools, setToolActive, isSuccess } = useTools();

  const { data: session } = useSession();
  const api = OauthApi.fromSession(session);

  const { data, refetch, isError } = useQuery(
    ['sid_info', session],
    async () => await api.get_info_sid(),
    {
      enabled: !!session,
      retry: false,
    }
  );

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <p>Tools</p>
          <FaCog />
        </div>
      }
      isShown={show}
      close={close}
    >
      <p>Select what external tools your agents have access to.</p>
      <div className="mt-5 flex flex-col gap-3 ">
        {activeTools.map((tool, i) => {
          if (tool.name === "sid") {
            return (
              <div
                key={i}
                className="relative overflow-hidden flex items-center gap-3 rounded-md border border-white/30 bg-zinc-800 p-2 px-4 text-white"
              >
                {(!!session || (data?.connected ?? false)) && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 backdrop-blur-sm" />
                    <Button
                      className="border-white/20 bg-gradient-to-t from-sky-500 to-sky-600 transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600"
                      onClick={async () => {
                        window.location.href = await api.install("sid");
                      }}>Connect your Data
                    </Button>
                  </div>
                )}
                <ToolAvatar tool={tool} />
                <div className="flex flex-grow flex-col gap-1">
                  <p className="font-bold capitalize">{tool.name}</p>
                  <p className="text-xs sm:text-sm">{tool.description}</p>
                </div>
                {(data?.connected ?? false) && (
                  <>
                    <Button onClick={() => { window.open('https://me.sid.ai/', '_blank'); }}>Manage</Button>
                    <Button
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full"
                      onClick={async () => {
                        let { success } = await api.uninstall("sid");
                        await refetch();
                      }}
                    >Disconnect</Button></>)}
                <Switch value={(!data?.connected ?? false) ? false : tool.active}
                  onChange={() => setToolActive(tool.name, !tool.active)} />
              </div>
            )
          } else {
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md border border-white/30 bg-zinc-800 p-2 px-4 text-white"
              >
                <ToolAvatar tool={tool} />
                <div className="flex flex-grow flex-col gap-1">
                  <p className="font-bold capitalize">{tool.name}</p>
                  <p className="text-xs sm:text-sm">{tool.description}</p>
                </div>
                <Switch value={tool.active} onChange={() => setToolActive(tool.name, !tool.active)} />
              </div>
            )
          }
        })}
        {!isSuccess && <p className="text-center text-red-300">Error loading tools.</p>}
      </div>
    </Dialog>
  );
};

const ToolAvatar = ({ tool }: { tool: ActiveTool }) => {
  if (tool.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={tool.name} width="40px" height="40px" src={tool.image_url} />;
  }

  return <div className="h-10 w-10 rounded-full border border-white/30 bg-amber-600" />;
};
