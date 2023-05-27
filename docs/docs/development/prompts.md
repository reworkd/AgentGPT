---
sidebar_position: 3
---

# 💬 Prompts

Prompts are what we use to dynamically align language model behaviour with the current agent goal / task. We primarily
use `gpt-3.5-turbo` for our agents, and it has shown that its results are **heavily** influenced by the smallest details
of its prompts.

## Getting started with prompting

- [Learn prompting docs](https://learnprompting.org/)
- [Prompt engineering guide](https://www.promptingguide.ai/techniques/consistency)
- [Prompt engineering for developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)

## Key terms

- **One shot / two shot / N shot:** You provide 1, 2, N examples alongside your prompt to further increase model
  accuracy
- **Zero shot:** You provide a prompt to a model directly (with no examples)

## Techniques in AgentGPT

### Plan and Solve

[Plan and solve (PS)](https://arxiv.org/abs/2305.04091) builds upon chain of thought prompting, a prompting approach
where simply asking a model for step-by-step instructions allows the model to more accurately reason about a problem. PS
is a zero shot approach to increase accuracy in reasoning about abstract goals. In essence, it involves asking the model
to:

1. First understand the problem
2. Extract relevant variables and corresponding values
3. Devise a complete plan, **step by step**

You can learn more through the paper's [GitHub repo](https://github.com/AGI-Edgerunners/Plan-and-Solve-Prompting). We
leverage plan and solve prompting to generate our initial task list when the agent is first run. This technique is
something similar to how BabyAGI operates.

### ReAct

ReAct stands for reasoning + action. It is a prompting technique that interleaves both reasoning and action generation
into a single output, allowing the model to better synergize thoughts with actions.
