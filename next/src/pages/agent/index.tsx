import type { GetStaticProps } from "next";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { FaBackspace, FaShare, FaTrash } from "react-icons/fa";

import nextI18NextConfig from "../../../next-i18next.config";
import Button from "../../components/Button";
import { ChatMessage } from "../../components/console/ChatMessage";
import ChatWindow from "../../components/console/ChatWindow";
import FadeIn from "../../components/motions/FadeIn";
import Toast from "../../components/toast";
import { env } from "../../env/client.mjs";
import DashboardLayout from "../../layout/dashboard";
import type { Message } from "../../types/message";
import { api } from "../../utils/api";
import { languages } from "../../utils/languages";

const AgentPage: NextPage = () => {
  const [t] = useTranslation();
  const [showCopied, setShowCopied] = useState(false);
  const router = useRouter();

  const agentId = typeof router.query.id === "string" ? router.query.id : "";

  const getAgent = api.agent.findById.useQuery(agentId, {
    enabled: router.isReady,
  });

  const deleteAgent = api.agent.deleteById.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
  });

  const messages = getAgent.data ? (getAgent.data.tasks as Message[]) : [];

  const shareLink = () => {
    return encodeURI(`${env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`);
  };

  return (
    <DashboardLayout>
      <div
        id="content"
        className="flex h-screen max-w-full flex-col items-center justify-center gap-3 px-3 pt-7 md:px-10"
      >
        <div className="flex w-full max-w-screen-md flex-grow flex-col items-center overflow-hidden">
          <ChatWindow messages={messages} title={getAgent?.data?.name} visibleOnMobile>
            {messages.map((message, index) => {
              return (
                <FadeIn key={`${index}-${message.type}`}>
                  <ChatMessage message={message} />
                </FadeIn>
              );
            })}
          </ChatWindow>
        </div>
        <div className="flex flex-row gap-2">
          <Button icon={<FaBackspace />} onClick={() => void router.push("/")}>
            Back
          </Button>
          <Button
            icon={<FaTrash />}
            loader
            onClick={() => {
              deleteAgent.mutate(agentId);
            }}
            enabledClassName={"bg-red-600 hover:bg-red-400"}
          >
            Delete
          </Button>

          <Button
            icon={<FaShare />}
            onClick={() => {
              void window.navigator.clipboard
                .writeText(shareLink())
                .then(() => setShowCopied(true));
            }}
            enabledClassName={"bg-green-600 hover:bg-green-400"}
          >
            Share
          </Button>
        </div>
        <Toast
          model={[showCopied, setShowCopied]}
          title={t("COPIED_TO_CLIPBOARD", { ns: "common" })}
          className="bg-gray-950 text-sm"
        />
      </div>
    </DashboardLayout>
  );
};

export default AgentPage;

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
