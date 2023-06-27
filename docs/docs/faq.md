---
sidebar_position: 4
---

# ❓ Frequently Asked Questions

### Introduction

Below is a list of the most frequently asked questions about AgentGPT. If you have any unanswered questions, please
reach out to the moderation or dev team on [Discord](https://discord.gg/jdSBAnmdnY)
or [GitHub](https://github.com/reworkd/AgentGPT).

### Agent issues

<details>
<summary>AgentGPT said it made a file / database / script, where can I find it?</summary>
Currently AgentGPT is incapable of outputs in that manner, but this is something we are actively working on.
Keep an eye on our <a href="/roadmap">roadmap</a> to get an idea for when this might be available.
</details>

<details>
<summary>Did AgentGPT actually email 100 people?</summary>
No! We don't currently support this functionality, but its something we're looking to implement. View our <a href="/roadmap">roadmap</a> to get an idea for when this might be available.
When this does work, we'll be sure to validate that an action like "sending an email" is actually something you want to do 🙂
</details>

<details>
<summary>My agent keeps running out of loops!</summary>
We must limit how much the Agent runs in some capacity due to API and infrastructure costs 😢.

To circumvent this, you can visit our <a href="/roadmap">setup documentation</a> and host AgentGPT locally using your
own API key.
Alternatively, you can subscribe to our pro plan to increase limits.
</details>

<details>
<summary>My Agent was doing great but then it got stopped! Can I start from where I left off?</summary>
Currently all Agent runs are isolated from each other so this is not possible.
This is something we want to add in the future, but in the meantime you can create another AgentGPT run using the information it generated for you from the previous run.
Keep an eye on our <a href="/roadmap">roadmap</a> to get an idea for when this might be available.
</details>

<details>
<summary>Can AgentGPT use GPT-4?</summary>
AgentGPT currently uses GPT-3.5 for free tier users with GPT-4 access for PRO users. If you have API access to GPT-4, you can run AgentGPT locally using the key and access GPT-4 in settings.
</details>

<details>
<summary>Why does the output keep getting cut off?</summary>
The longer the output is, the more expensive it is on our end to generate it.
Because of this, we have a limit on the output length which can cause longer messages to be cut off.
If you provide your own API key, you can increase the output length within the advanced settings of the settings menu by increasing the number of tokens.
</details>

### Misc

<details>
<summary>What is the difference between this and ChatGPT?</summary>
ChatGPT is a great tool that will allow you to ask a specific question and receive a result. It also follows a conversation, so after you have received a response, you can continue talking to it and it will remember (within limits) what was discussed previously.

AgentGPT on the otherhand is a platform for AI agents. You configure an agent to accomplish a broad goal, and it will
automatically think and perform tasks to achieve it.
</details>

<details>
<summary>What is the difference between this and AutoGPT?</summary>
Both AgentGPT and AutoGPT are projects involving autonomous AI agents. AutoGPT is a tool that one runs locally while AgentGPT is a web based platform.
</details>

<details>
<summary>What can AgentGPT do?</summary>
AgentGPT can do a lot, but we're also working on giving it a lot more capabilities. Visit our <a href="/usecases">usecases</a> page to learn about how people currently use AgentGPT.
</details>

<details>
<summary>Does AgentGPT have access to the internet?</summary>
Yes it can 🌐!
</details>

### Local contribution issues

<details>
<summary>I'm having trouble setting up AgentGPT locally!</summary>
Please visit our <a href="/development/setup">setup</a> guide to diagnose any issues. If you have a problem that is undocumented, please submit an <a href="https://github.com/reworkd/AgentGPT/issues">issue on GitHub</a>.
</details>




