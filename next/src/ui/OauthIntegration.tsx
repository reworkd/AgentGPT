import { useSession } from "next-auth/react";

import Button from "./button";
import OauthApi from "../services/workflow/oauthApi";
import { useWorkflowStore } from "../stores/workflowStore";

const OauthIntegration = () => {
  const { data: session } = useSession();
  const workflow = useWorkflowStore.getState().workflow;
  const api = OauthApi.fromSession(session, `/workflow/${workflow?.id || ""}`);

  return (
    <div>
      <Button
        onClick={async () => {
          const url = await api.install("slack");
          window.open(url, "_blank");
        }}
      >
        Connect Slack
      </Button>
    </div>
  );
};

export default OauthIntegration;
