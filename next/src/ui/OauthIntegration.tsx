import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { FC } from "react";
import { useState } from "react";

import Button from "./button";
import Combo from "./combox";
import OauthApi from "../services/workflow/oauthApi";
import { useWorkflowStore } from "../stores/workflowStore";

interface Channel {
  id: string;
  name: string;
}

const OauthIntegration: FC<{
  value: string | undefined;
  onChange: (value: string) => void;
}> = (props) => {
  const { data: session } = useSession();
  const workflow = useWorkflowStore.getState().workflow;
  const api = OauthApi.fromSession(session);

  const defaultValue = props.value ? { id: props.value, name: props.value } : undefined;
  const [selected, setSelected] = useState<Channel | undefined>(defaultValue);
  const { data, refetch, isError } = useQuery(
    [undefined],
    async () => await api.get_info("slack"),
    {
      enabled: !!session,
      retry: false,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      {isError && (
        <Button
          onClick={async () => {
            const url = await api.install("slack");
            window.open(url, "_blank");
          }}
        >
          Connect Slack
        </Button>
      )}
      {data && (
        <Combo<Channel>
          items={data}
          label="Slack Channel"
          value={selected}
          valueMapper={(e) => e.name}
          onChange={(e) => {
            setSelected(e);
            props.onChange(e.id);
          }}
        />
      )}
    </div>
  );
};

export default OauthIntegration;
