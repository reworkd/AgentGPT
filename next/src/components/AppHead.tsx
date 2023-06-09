import Head from "next/head";

const AppHead = () => {
  // Do not translate. Head attributes won't have access to i18n.
  const description = "Assemble, configure, and deploy autonomous AI Agents in your browser.";

  return (
    <Head>
      <title>AgentGPT</title>
      <meta name="description" content={description} />
      <meta name="twitter:site" content="@AgentGPT" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="AgentGPT 🤖" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://agentgpt.reworkd.ai/banner.png" />
      <meta name="twitter:image:width" content="1280" />
      <meta name="twitter:image:height" content="640" />
      <meta property="og:title" content="AgentGPT: Autonomous AI in your browser 🤖" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://agentgpt.reworkd.ai/" />
      <meta property="og:image" content="https://agentgpt.reworkd.ai/banner.png" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="640" />
      <meta property="og:type" content="website" />
      <meta
        name="google-site-verification"
        content="sG4QDkC8g2oxKSopgJdIe2hQ_SaJDaEaBjwCXZNkNWA"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default AppHead;