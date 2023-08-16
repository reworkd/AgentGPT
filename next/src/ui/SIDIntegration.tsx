import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { FC } from "react";
import { useState } from "react";

import Button from "./button";
import OauthApi from "../services/workflow/oauthApi";

const SIDIntegration: FC<{}> = (props) => {
  const { data: session } = useSession();
  const api = OauthApi.fromSession(session);

  const { data, refetch, isError } = useQuery(
    [undefined],
    async () => await api.get_info_sid(),
    {
      enabled: !!session,
      retry: false,
    }
  );

  return (
    <div className="flex flex-col text-white">
      {!data && (
        <Button
        className="bg-gray-900 hover:bg-gray-700 text-white font-bold rounded"
        >Loading...</Button>
      )}
      {data && !data.connected && (
        <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
          onClick={async () => {
            const url = await api.install("sid");
            window.open(url, "_blank");
          }}
        >
          Connect SID
        </Button>
      )}
      {data && data.connected && (
        <Button
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
          onClick={async () => {
            let { success } = await api.uninstall("sid");
            refetch();
          }}
        >Disconnect SID</Button>
      )}
    </div>
  );
};

export default SIDIntegration;