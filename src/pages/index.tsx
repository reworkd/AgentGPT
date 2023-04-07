import { type NextPage } from "next";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import Badge from "../components/Badge";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Agent-GPT</title>
        <meta name="description" content="Agent-GPT b Reworkd.ai" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]">
        <DottedGridBackground>
          <div id="title" className="flex gap-4 items-center">
            <div className="font-bold text-4xl text-[#C0C0C0]">AgentGPT</div>
            <Badge>Beta 🚀</Badge>
          </div>
        </DottedGridBackground>
      </main>
    </>
  );
};

export default Home;