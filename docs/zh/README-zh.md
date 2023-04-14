<p align="center">
  <img src="https://raw.githubusercontent.com/reworkd/AgentGPT/main/public/banner.png?token=GHSAT0AAAAAAB7JND3U3VGGF3UYYHGYO4RAZBSDJAQ" height="300"/>
</p>
[English](./README-en.md) | [中文](../zh/README-zh.md)
<p align="center">
  <em>🤖 在浏览器中组装、配置和部署自主 AI 代理。 🤖 </em>
</p>
<p align="center">
    <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=16.0.0&logo=node.js&color=2334D058" />
</p>

<p align="center">
<a href="https://agentgpt.reworkd.ai">🔗 短链接</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-getting-started">🤝 参与贡献</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://twitter.com/asimdotshrestha/status/1644883727707959296">🐦 Twitter</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://discord.gg/3PccggEG">📢 Discord</a>
</p>

---

<h2 align="center">
💝 支持 AgentGPT 的发展!! 💝
</h2>

<p align="center">
加入我们，推动 AgentGPT 的发展，这是一个推动 AI 自主边界的开源项目！我们面临着支付运营成本的挑战 💸，包括内部 API 和其他基础设施费用，预计每天将增长到约 150 美元 💳🤕 你的赞助将通过帮助我们扩大资源、增强功能和不断迭代这个令人兴奋的项目来推动进步！ 🚀
</p>

<p align="center">
通过赞助这个免费的开源项目，你不仅有机会在下方展示你的头像/徽标，还可以独家与创始人交流！🗣️ 
</p>

<p align="center">
<a href="https://github.com/sponsors/reworkd-admin">👉 点击此处</a> 支持项目 
</p>

---

AgentGPT 可以让你配置和部署自主 AI 代理。
为你的定制 AI 命名，并让它执行任何可以想象的目标。
它将通过思考要执行的任务，执行任务并从结果中学习来尝试实现目标 🚀。

## 🎉 路线图

该平台目前处于测试阶段，我们正在努力：

- 长期记忆通过矢量数据库实现 🧠
- 通过 langchain 实现网络浏览能力 🌐
- 与网站和人互动通过文档 API 实现写 👨‍👩‍👦
- 通过文档API实现写作能力 📄
- 保存代理运行 💾
- 用户和身份验证 🔐
- 集成 Stripe 以提供较低限制的付费版本（以便我们不再担心基础设施成本）💵

更多功能即将推出...

## 🚀 技术栈

- ✅ **Bootstrapping**：[create-t3-app](https://create.t3.gg)。
- ✅ **Framework**：[Nextjs 13 + Typescript](https://nextjs.org/)。
- ✅ **Auth**：[Next-Auth.js](https://next-auth.js.org)
- ✅ **ORM**：[Prisma](https://prisma.io)。
- ✅ **Database**：[Supabase](https://supabase.com/)。
- ✅ **Styling**：[TailwindCSS + HeadlessUI](https://tailwindcss.com)。
- ✅ **Typescript Schema Validation**：[Zod](https://github.com/colinhacks/zod)。
- ✅ **End-to-end typesafe API**：[tRPC](https://trpc.io/)。

## 👨‍🚀 入门指南

### 🐳 Docker 设置

使用 Docker 是在本地运行 AgentGPT 的最简单方法。
提供了一个方便的设置脚本，帮助你入门。

```bash
./setup.sh --docker
```

### 👷 本地开发设置

如果你想在本地开发AgentGPT，最简单的方法是
使用提供的设置脚本。

```bash
./setup.sh --local
```

### 🛠️ 手动设置

> 🚧 你需要安装[Nodejs +18 (LTS推荐)](https://nodejs.org/en/)。

1. 叉开这个项目：

    -[点击这里](https://github.com/reworkd/AgentGPT/fork)。

2. 克隆版本库：

```bash
git clone git@github.com:YOU_USER/AgentGPT.git
```

3. 安装依赖项：

```bash
cd AgentGPT
npm install
```

4. 创建一个 a.**env**文件，内容如下：

> 🚧 环境变量必须符合以下[模式](https://github.com/reworkd/AgentGPT/blob/main/src/env/schema.mjs)。

```bash
# 部署环境：
NODE_ENV=development

# 下一个Auth配置：
# 用`openssl rand -base64 32`生成一个秘密
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./db.sqlite

# 你的开放api密钥
OPENAI_API_KEY=changeme
```

5. 修改prisma模式以使用sqlite：

```bash
./prisma/use_sqlite.sh
```

**注意:** 只有在你希望使用sqlite时才需要这样做。

6. 准备好🥳，现在运行：

```bash
# 创建数据库迁移
npx prisma db push

# 运行该项目：
npm run dev
```
