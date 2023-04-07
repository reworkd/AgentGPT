import { type ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";

interface LayoutProps {
  children: ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
  return (
    <div className="flex min-h-screen min-h-screen flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]">
      <Head>
        <title>Agent-GPT</title>
        <meta name="description" content="Agent-GPT b Reworkd.ai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DottedGridBackground>{props.children}</DottedGridBackground>
      {/*<Footer />*/}
    </div>
  );
};

export default DefaultLayout;
