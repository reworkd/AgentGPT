import { type ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";

interface LayoutProps {
  children: ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  const description =
    "Assemble, configure, and deploy autonomous AI Agents in your browser.";
  return (
    <div className="flex min-h-screen min-h-screen flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]">
      <Head>
        <title>AgentGPT</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="https://agentgpt.reworkd.ai/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Assemble, configure, and deploy autonomous AI Agents in your browser."
        />
        <meta
          property="og:title"
          content="AgentGPT: Autonomous AI in your browser 🤖"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/reworkd/AgentGPT/main/public/banner.png?token=GHSAT0AAAAAAB7JND3U6YNFAMHQ3QLSZ6DQZBRXUXA"
        />
      </Head>
      <DottedGridBackground>{props.children}</DottedGridBackground>
    </div>
  );
};

export default DefaultLayout;
