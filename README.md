<p align="center">
  <h1>AGENT GPT</h1></br>
  <em>🤖 Assemble, configure, and deploy autonomous AI Agents in your browser. 🤖 </em>
</p>
<p align="center">
 <a href="https://agentgpt.reworkd.ai/" target="_blank">
  <img alt="Deployment Success" src="https://img.shields.io/github/deployments/reworkd/AgentGPT/production?color=2334D058&label=Deployment" />
 </a>
 <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=16.0.0&logo=node.js&color=2334D058" />
</p>

<p align="center">
<a href="https://agentgpt.reworkd.ai">🔗 Short link</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-getting-started">🤝 Contribute</a>
</p>

---

Assemble, configure, and deploy autonomous AI Agents in your browser. 

## 🎉 Features

Coming soon...

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

> 🚧 You will need [Nodejs +16 (LTS recommended)](https://nodejs.org/en/) installed.

1. Fork this project:

- [Click here](https://github.com/reworkd/AgentGPT/fork).

2. Clone the repository:

```bash
git clone git@github.com:YOU_USER/AgentGPT.git
```

3. Install dependencies:

```bash
npm install
```

4. Create a **.env** file with the following content:

> 🚧 The environment variables must match the following [schema](https://github.com/reworkd/AgentGPT/blob/main/src/env/schema.mjs).

```bash
# Next Auth Secrets
NODE_ENV=production
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Next Auth config:
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Database URLs:
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

5. Ready 🥳, now run:

```bash
# Create database migrations
npx prisma db push

# Run the project:
npm run dev
```
