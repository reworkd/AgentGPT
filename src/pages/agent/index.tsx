import { type NextPage } from "next";
import DefaultLayout from "../../layout/default";
import Button from "../../components/Button";

import React from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import ChatWindow from "../../components/ChatWindow";
import type { Message } from "../../types/agentTypes";

const AgentPage: NextPage = () => {
  const router = useRouter();
  const agentId = router.query.id as string;

  const getAgent = api.agent.findById.useQuery(agentId, {
    enabled: router.isReady,
  });
  const deleteAgent = api.agent.deleteById.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
  });

  const messages = getAgent.data ? (getAgent.data.tasks as Message[]) : [];

  return (
    <DefaultLayout
      className="mx-4 flex flex-col items-center justify-center gap-4 md:w-[80%]"
      centered
    >
      <ChatWindow
        messages={messages}
        title={getAgent?.data?.name}
        showDonation={false}
      />
      <div className="flex flex-row gap-2">
        <Button onClick={() => void router.push("/")}>Back</Button>
        <Button
          onClick={() => {
            deleteAgent.mutate(agentId);
          }}
          enabledClassName={"bg-red-600 hover:bg-red-400"}
        >
          Delete
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default AgentPage;
