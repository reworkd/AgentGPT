<p align="center">
  <img src="https://raw.githubusercontent.com/reworkd/AgentGPT/main/public/banner.png?token=GHSAT0AAAAAAB7JND3U3VGGF3UYYHGYO4RAZBSDJAQ" height="300"/>
</p>
<p align="center">
  <em>🤖 Assemble, configure, and deploy autonomous AI Agents in your browser. 🤖 </em>
</p>
<p align="center">
    <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=16.0.0&logo=node.js&color=2334D058" />
</p>

<p align="center">
<a href="https://agentgpt.reworkd.ai">🔗 Short link</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-getting-started">🤝 Contribute</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://twitter.com/asimdotshrestha/status/1644883727707959296">🐦 Twitter</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://discord.gg/3PccggEG">📢 Discord</a>
</p>

---

<h2 align="center">
💝 Support the Advancement of AgentGPT!! 💝
</h2>

<p align="center">
Join us in fueling the development of AgentGPT, an open-source project pushing the boundaries of AI autonomy! We're facing challenges in covering the operational costs 💸, including in-house API and other infrastructure expenses, which is projected to grow to around $150 USD per day 💳🤕 Your sponsorship would drive progress by helping us scale up resources, enhance features and functionality, and continue to iterate on this exciting project! 🚀
</p>

<p align="center">
By sponsoring this free, open-source project, you not only have the opportunity to have your avatar/logo featured below, but also get the exclusive chance to chat with the founders!🗣️ 
</p>

<p align="center">
<a href="https://github.com/sponsors/reworkd-admin">👉 Click here</a> to support the project 
</p>

---

AgentGPT allows you to configure and deploy Autonomous AI agents.
Name your own custom AI and have it embark on any goal imaginable.
It will attempt to reach the goal by thinking of tasks to do, executing them, and learning from the results 🚀.

## 🎉 Roadmap

This platform is currently in beta, we are currently working on:

- Long term memory via a vector DB 🧠
- Web browsing capabilities via langchain 🌐
- Interaction with websites and people 👨‍👩‍👦
- Writing capabilities via a document API 📄
- Saving agent runs 💾
- Users and authentication 🔐
- Stripe integration for a lower limit paid version (So we can stop worrying about infra costs) 💵

More Coming soon...

## 🚀 Tech Stack

- ✅ **Bootstrapping**: [create-t3-app](https://create.t3.gg).
- ✅ **Framework**: [Nextjs 13 + Typescript](https://nextjs.org/).
- ✅ **Auth**: [Next-Auth.js](https://next-auth.js.org)
- ✅ **ORM**: [Prisma](https://prisma.io).
- ✅ **Database**: [Supabase](https://supabase.com/).
- ✅ **Styling**: [TailwindCSS + HeadlessUI](https://tailwindcss.com).
- ✅ **Typescript Schema Validation**: [Zod](https://github.com/colinhacks/zod).
- ✅ **End-to-end typesafe API**: [tRPC](https://trpc.io/).

## 👨‍🚀 Getting Started

### 🐳 Docker Setup

The easiest way to run AgentGPT locally is by using docker.
A convenient setup script is provided to help you get started.

```bash
./setup.sh --docker
```

### 👷 Local Development Setup

If you wish to develop AgentGPT locally, the easiest way is to
use the provided setup script.

```bash
./setup.sh --local
```

### 🛠️ Manual Setup

> 🚧 You will need [Nodejs +18 (LTS recommended)](https://nodejs.org/en/) installed.

1. Fork this project:

- [Click here](https://github.com/reworkd/AgentGPT/fork).

2. Clone the repository:

```bash
git clone git@github.com:YOU_USER/AgentGPT.git
```

3. Install dependencies:

```bash
cd AgentGPT
npm install
```

4. Create a **.env** file with the following content:

> 🚧 The environment variables must match the following [schema](https://github.com/reworkd/AgentGPT/blob/main/src/env/schema.mjs).

```bash
# Deployment Environment:
NODE_ENV=development

# Next Auth config:
# Generate a secret with `openssl rand -base64 32`
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./db.sqlite

# Your open api key
OPENAI_API_KEY=changeme
```

5. Modify prisma schema to use sqlite:

```bash
./prisma/useSqlite.sh
```

**Note:** This only needs to be done if you wish to use sqlite.

6. Ready 🥳, now run:

```bash
# Create database migrations
npx prisma db push
npm run dev
```

### 🚀 GitHub Codespaces

Set up AgentGPT in the cloud immediately by using [GitHub Codespaces](https://github.com/features/codespaces).

1. From the GitHub repo, click the green "Code" button and select "Codespaces".
2. Create a new Codespace or select a previous one you've already created.
3. Codespaces opens in a separate tab in your browser.
4. In terminal, run `bash ./setup.sh --local`
5. When prompted in terminal, add your OpenAI API key.
6. Click "Open in browser" when the build process completes.

- To shut AgentGPT down, enter Ctrl+C in Terminal.
- To restart AgentGPT, run `npm run dev` in Terminal.

Run the project 🥳

```
npm run dev
```
