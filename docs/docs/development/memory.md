---
sidebar_position: 5
---

# 🧠 Memory

To fulfill a given goal, AI agents perform a multitude of tasks, taking into account their own execution history.
When agents are long-running, this becomes a problem as their memory is typically only as large as their context length.
In the case of GPT-3.5 and GPT-4, this is roughly 8k tokens.

What this means with AgentGPT is that once your agents have run for a few loops, they've completely forgotten about what
they
did before. To solve this, we need to save agent memory externally which is exactly where Vector Databases come into
play.

## What is a Vector Database?

To best learn about vector databases, we recommend looking at external documentation such as
the [Weaviate docs](https://weaviate.io/developers/weaviate).

Essentially, vector databases allow us to save task and task execution history externally, allowing agents to access
memory from many loops prior. This is done through similarity search over text.

Intuitively, when we as humans want to remember something, we try to think of related words or phrases. Eventually,
we find a collection of information related to that topic in our head and act upon it.
This framework is similar to how a Vector DB operates.

## Weaviate

The vector DB we use by default in AgentGPT is Weaviate. We use them for the following reasons:

- They're open source and easily accessible through docker-compose. This means local AgentGPT runs won't require you to
  generate an API key.
- They have a cloud offering that can scale with our workload, allowing us to avoid managing more infrastructure
- They integrate well with tools like LangChain

If you'd like to add your own databases however, please feel free to make a ticket / PR :)

## Memory in AgentGPT

Using long term memory is still a work in progress. Here are some ways we're using it below:

- Filtering similar tasks used in a given run.
- More to come...

If you have any ideas for memory or want to help, please do reach out!
