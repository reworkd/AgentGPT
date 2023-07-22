---
title: "Understanding AgentGPT: How we build AI agents that reason, remember, and perform."
description: "How we build AI agents that reason, remember, and perform."
imageUrl: "https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fef520689-ca1b-4489-98aa-41136f565840%2FCybrCo_Art_human-like_robot_typing_on_a_computer_in_a_dark_room_a0174b88-a5b9-4b82-98c6-734dbbde8d09.webp?id=f768fec9-bd6a-43ae-811d-1adb065c6c8e&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2"
date: "July 17th, 2023"
datetime: "2023-07-17"
category:
  title: "Tech"
  href: "#"
author:
  name: "Arthur Riechert"
  role: "Writer"
  href: "#"
  imageUrl: "https://pbs.twimg.com/profile_images/1676828916546248704/5YMDlr1U_400x400.jpg"
---

![CybrCo_Art_human-like_robot_typing_on_a_computer_in_a_dark_room_a0174b88-a5b9-4b82-98c6-734dbbde8d09.webp](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fef520689-ca1b-4489-98aa-41136f565840%2FCybrCo_Art_human-like_robot_typing_on_a_computer_in_a_dark_room_a0174b88-a5b9-4b82-98c6-734dbbde8d09.webp?id=f768fec9-bd6a-43ae-811d-1adb065c6c8e&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2)

> Alt: A robotic agent types at a laptop in a dark room.

---

The invention of the **Generative Pre-trained Transformer (GPT)** is one of the recent decade's most important
advancements in AI technology. The GPTs powering today's **Large Language Models (LLMs)** demonstrate a _remarkable
ability for reasoning, understanding, and planning_. However, their true potential has yet to be fully realized.

At **Reworkd**, we believe that the _true power of LLMs lies in agentic behavior_. By engineering a system that draws on
LLMs' emergent abilities and providing an ecosystem that supports environmental interactions, we can draw out the full
potential of models like GPT-4. Here's how AgentGPT works.

## LLMs have a lot of limitations.

The main products shipping LLMs are chatbots powered by

[Foundation Model - Techopedia](https://www.techopedia.com/definition/34826/foundation-model).

If you have any familiarity working with OpenAI's API, a common formula you might use for chatting with the model may
include:

- Taking the user's message.
- Adding a list of chat histories.
- Sending the chat history across the API to retrieve a completion.

This method works fine when the scope of conversations is small; however, _as you continue adding new messages to the
chat history, the size and complexity of completions balloons_, and you will quickly run into a wall: the dreaded
context limit.

A **context limit** is the maximum number of **tokens** (a token usually represents a single word) that can be input
into
the model for a single response. They are necessary because the _computational cost as we add additional tokens tends to
increase quadratically_. However, they are often the bane of prompt engineers.

One solution is to measure the number of tokens in the chat history before sending it to the model and removing old
messages to ensure it fits the token limit. While this approach works, it ultimately reduces the amount of knowledge
available to the assistant.

Another issue that standalone LLMs face is the need for human guidance. Fundamentally, LLMs are next-word predictors,
and often, their internal structure is not inherently suited to higher-order thought processes, such as **reasoning**
through complex tasks. This weakness doesn't mean they can't or don't reason. In fact, there are several [studies](https://arxiv.org/abs/2205.11916#:~:text=While%20these%20successes%20are%20often%20attributed%20to%20LLMs%27,%22Let%27s%20think%20step%20by%20step%22%20before%20each%20answer.) that shows they can. However, it does mean they face certain impediments. For example, the LLM itself can create a logical list of steps; however, it has _no built-in mechanisms for observation and reflection on that list._

A pre-trained model is essentially a "black box" for the end user in which the final product that is shipped has
_limited to no capability of actively updating its knowledge base and tends to act in unpredictable ways_. As a result,
it's [hallucination](https://arxiv.org/abs/2202.03629)-prone.

Thus, it requires a lot of effort on the user's part to guide the model's output, and prompting the LLM itself becomes a
job on its own. This extra work is a far cry from our vision of an AI-powered future.

By providing a platform to give LLMs agentic abilities, _AgentGPT aims to overcome the limitations of standalone LLMs by
leveraging prompt engineering techniques, vector databases, and API tooling._ Here’s some interesting work that is being
done with the agent concept:

[![Tweet by Dr. Jim Fan](https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=1673006745067847683&lang=en&origin=https%3A%2F%2Fpublish.twitter.com%2F%3Fquery%3Dhttps3A2F2Ftwitter.com2FDrJimFan2Fstatus2F1673006745067847683%26widget%3DTweet&theme=light&widgetsVersion=82e1070%3A1619632193066&width=550px)](https://twitter.com/DrJimFan/status/1673006745067847683)

> Alt: A Twitter post by Dr. Jim Fan

## What are agents?

In a general sense, [agents](https://zapier.com/blog/ai-agent/) are rational actors. They use thinking and reasoning to
influence their environment. _This could be in the form of solving problems or pursuing specific goals. They might
interact with humans or utilize tools._ Ultimately, we can apply this concept to LLMs to instill more intelligent and
logical behavior.

In AgentGPT, large language models essentially function as the **brain** of each agent. As a result, we can produce
powerful agents by cleverly _manipulating the English language_ and engineering a _framework that supports
interoperability between LLM completions and a diverse set of APIs_.

### Engineering this system consists of 3 parts.

**Reasoning and Planning.** If you were to simply take a general goal, such as "build a scaling e-commerce platform,"
and
give it to ChatGPT, you would likely get a response along the lines of "As an AI language model…." However, through
**prompt engineering**, we can get a model to _break down goals into digestible steps and reflect on them_ with a method
called chain of thought prompting.

**Memory.** When dealing with memory, we divide the problem into **short-term** and **long-term**. In managing
short-term
memory, we can use prompting techniques such as _few-shot prompting to steer LLM responses_. However, _cost and context
limits make it tricky to generate completions without limiting the breadth of information_ a model can use to make
decisions.

Similarly, this issue also arises in **long-term memory** because it would be impossible to provide an appropriate
corpus
of writing to bridge the gap between GPT -4's cutoff date, 2021, till today. By using vector databases, we attempt to
overcome this using specialized models for _information retrieval in high-dimensional vector spaces_.

**Tools**. Another challenge in using LLMs as general actors is their confinement to text outputs. Again, we can use
prompt engineering techniques to solve this issue. We can generate predictable function calls from the LLM through
few-shot and chain-of-thought methods, utilizing API tools like **Google Search**, **Hugging Face**, **Dall-E**, etc. In
addition, we can use fine-tuned LLMs that only return responses in specialized formatting, like JSON. This is the
approach OpenAI took when they recently released the function calling feature for their API.

These three concepts have formed the backbone of multiple successful agent-based LLM platforms such
as [Microsoft Jarvis](https://github.com/microsoft/JARVIS), [AutoGPT](https://github.com/Significant-Gravitas/Auto-GPT), [BabyAGI](https://github.com/yoheinakajima/babyagi),
and of course, AgentGPT. With this brief overview in mind, let's dive deeper into each component.

## How do we get agents to act intelligently?

**Prompt engineering** has become highly popularized, and it's only natural given its ability to _increase the
reliability of LLM responses_, opening a wide avenue of potential applications for generative AI. AgentGPT's ability to
think and reason is a result of novel prompting methods.

### A Brief Intro to Prompt Engineering

Prompt engineering is a largely empirical field that aims to find methods to steer LLM responses by finding clever ways
to use the English language. _You can think of it like lawyering, where every nuance in the wording of a prompt counts._

These are the main concepts and building blocks for more advanced prompting techniques:

1. **Zero-Shot** involves sending the raw command directly to the LLM with little to no formatting.
2. **Few-Shot** gives context for completions in the form of example responses.
3. **Chain-of-Thought** guides the model in reasoning through generating and reasoning over a complex task.

### How AgentGPT Uses Prompt Engineering

AgentGPT uses an advanced form of chain-of-thought prompting called **Plan-and-Solve** to generate the steps you see
when
operating the agents.

Traditionally, chain-of-thought prompting utilized few-shot techniques to provide examples of a thinking and reasoning
process. However, as is becomes a theme, it becomes more costly as the complexity of a task increases because we will
need to provide more context.

**Plan-and-solve (PS):** By virtue of being a zero-shot method, it provides a _prompting framework for LLM-guided
reasoning using "trigger" words_. These keywords trigger a reasoning response from the model.

We can expand on this concept by _modifying the prompt to extract important variables and steps to generate a final
response with a cohesive format_. This method allows us to parse the final response and display it for the end user as
well as feed sub-steps into future plan-and-solve prompts.

![Screen Shot 2023-07-01 at 12.25.37 PM.png](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F29d8c98c-21e6-4991-992d-62d95fd40dba%2FScreen_Shot_2023-07-01_at_12.25.37_PM.png?id=021895a6-149a-4282-aa8e-6719e7d7c47a&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2)

> Alt: Picture of Plan & Solve

While PS prompting helps evoke a reasoning response, it still misses a fundamental concept in reasoning, and that is
proper handling for reflection and action. **Reflection**is _fundamental for any agent because it must rationalize an
action, perform that action, and use feedback to adjust future actions._ Without it, the agent would be stateless and
unchanging.

AgentGPT uses a prompting framework called Reasoning and Acting ([ReAct](https://arxiv.org/pdf/2210.03629.pdf)) to
expand on the capabilities of the Plan-and-Solve concept. **ReAct** aims to _enable a framework for the model to access
fresh knowledge through external knowledge bases and make observations of actions it has taken_. Using those
observations, the LLM can make educated decisions on the next set of steps to complete while performing actions to query
knowledge bases such as **Google Search** or **Wikipedia API**.

Prompt engineering is largely effective in resolving challenges in short-term memory as well as instilling the reasoning
behavior that you can see when AgentGPT is at work. However, prompt engineering does not resolve the issue of long-term
memory. This issue is where vector databases come in, and we will look at those next.

![Screen Shot 2023-07-03 at 3.12.56 AM.png](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F481f0812-00e5-4cb1-9ed6-4f2f9215eef5%2FScreen_Shot_2023-07-03_at_3.12.56_AM.png?id=8002f409-2913-4e68-b8b6-6100c4128cf5&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2)

> Alt : ReAct (Reason + Act) Logic Picture

> The ReAct framework allows us to generate a reasoning response, an action, and a reflection to
> steer the model’s response. This example is courtesy of the following
> paper: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)\*

## How do we give agents a working memory?

While we have seen that _prompt engineering is largely effective in resolving issues with short-term memory and
reasoning_, we cannot solve long-term memory solely through clever English. Since we are not allowed to update the model
to learn our data, we must build an external system for storing and retrieving knowledge.

A clever solution might use an LLM to _generate summaries of previous conversations as context for the prompt_. However,
there are three significant issues with this. First, we are diluting the relevant information for the conversation;
second, it introduces another cost area by paying for API usage for those summaries; and third, it's unscalable.

Thus, prompts appear to be ineffective for long-term memory. Seeing as _long-term memory is a problem of storage and
efficient retrieval of information_, there is no absence of research in the study of search, so we must look towards
vector databases.

### Vector Databases Demystified

**[Vector databases](https://aws.amazon.com/what-is/vector-databases/)** have been hyped up for a while now, and the
hype
is very deserved. They are an efficient way of storing and retrieving vectors by allowing us to use some fun new
_algorithms to query billions - even trillions - of data records in milliseconds._

Let's start with a little bit of vocabulary:

- A **vector** in the context of an LLM is a representation of a piece of text that a model like GPT-4 encodes.
- A **vector space** contains many of these vectors.
- An **embedding** is the vectorized version of a text.

### Vector libraries like

[Facebook AI Similarity Search](https://www.bing.com/ck/a?!&&p=a0f4167bc6cd7db9JmltdHM9MTY4ODM0MjQwMCZpZ3VpZD0zOTYwYjczZS1hNzg2LTY5Y2MtMjM2YS1hNDdmYTYwMjY4MjImaW5zaWQ9NTIwMQ&ptn=3&hsh=3&fclid=3960b73e-a786-69cc-236a-a47fa6026822&psq=faiss+github&u=a1aHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rcmVzZWFyY2gvZmFpc3M&ntb=1) (
FAISS) give us access to valuable _tools to control these vectors and locate them efficiently in the vector space._

Since the text is in a numerical embedding dictated by the model type (i.e., text-embedding-ada-002), there is some
location in space that the text exists in, and it's based on the numbers that compose its vector. That means _similar
texts will be represented as vectors with similar numbers, and thus, they will likely be grouped closely. On the other
hand, less similar texts will be further away_. For example, texts about cooking will be closer to food than texts about
physics.

There are several different algorithms for querying the vector space, but the most relevant to this discussion is the
cosine similarity search. **[Cosine similarity](https://www.geeksforgeeks.org/cosine-similarity/)** measures the cosine
of the angle between two non-zero vectors. _It is a measure of orientation, meaning that it's used to determine how
similar two documents (or whatever the vectors represent) are_. Cosine similarity can range from -1 to 1, with -1
meaning the vectors are diametrically opposed (completely opposite), 0 meaning the vectors are orthogonal (or
unrelated), and 1 meaning the vectors are identical.

FAISS is helpful in managing these vector spaces, but it is not a database. _Vector libraries
lack [CRUD](https://www.freecodecamp.org/news/crud-operations-explained/) operations, which makes them alone unviable
for long-term memory_, and that's where cloud services such as Pinecone and Weaviate step in.

**Pinecone** and **Weaviate** essentially do all the hard work of managing our vectors. They provide an API that allows
you
to upload embeddings, perform various types of searches, and store those vectors for later. _They provide the typical
CRUD functions we need to instill memory into LLMs in easily-accessible Python modules._

By using them, we can encode large amounts of information for future storage and retrieval. For instance, when the LLM
needs extra knowledge to complete a task, we can prompt it to query the vector space to find relevant information. Thus,
we can create long-term memory.

![CybrCo_Art_A_human-like_robot_touching_a_flower_for_the_first_t_92e97d56-54fa-4bb0-8581-5a1e15fd94aa.webp](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fad2521b3-1c6b-4f16-b719-d2b766570c61%2FCybrCo_Art_A_human-like_robot_touching_a_flower_for_the_first_t_92e97d56-54fa-4bb0-8581-5a1e15fd94aa.webp?id=8d261d10-f4e4-4798-bc33-8f40da67bb42&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2)

> Alt : Robot With A Rose In Hand

## Tools to interact with the environment

While **prompt engineering** and **vector databases** resolve many of the limitations and challenges of LLMs, there is
still the problem of agent interaction. _How can we extend the capabilities of an LLM to interact with the environment
outside of text?_

APIs are the answer. By utilizing APIs, we can give our agents the ability to perform a wide range of actions and
access external resources.

Here are a few examples:

- **Google Search API**: Allows agents to search the web and retrieve relevant information.
- **Hugging Face**: Provides access to various NLP models and transformers for tasks such as summarization, translation,
  sentiment analysis, and more.
- **Dall-E**: Enables agents to generate images from textual descriptions.
- **OpenAI's GPT API**: Allows agents to utilize the GPT-4 model for text completion and generation.

Using API tools in combination with prompt engineering techniques, we can create prompts that generate predictable
function calls and utilize the output of API requests to enhance the agent's capabilities. This enables agents to
interact with the environment in a meaningful way beyond text-based interactions.

### Engineering Robust Function Calls

Again, we can achieve tooling through prompt engineering by _representing the tool we want to provide for the model_ as a **function**. _We can then tell the model that this function exists in a prompt, so our program can call it programmatically based on the model's response_. First, however, we should examine the main challenges in implementing tool interactions: consistency, context, and format.

For example, responses tend to vary among chat completions that use the same prompt. Thus, getting the LLM to issue a function call consistently is challenging. A minor solution may include adjusting the **temperature** of the model (a parameter to control the randomness), but the best solution should leverage an LLM's reasoning abilities. Thus, _we can use the ReAct framework to help the llm understand when to issue function calls._

In doing this, we will still run into another major issue. How will the LLMs understand what tools are at their disposal? We could include the available tools in a prompt, but this could significantly increase the number of tokens we would need to send to the model. While this may be fine for an application that runs on a couple of tools, it will increase costs as we add more tools to the system. Thus, _we would use vector databases to help the LLM look up relevant tools it needs._

Finally, we need to generate function calls in a predictable format. This format should include provisions for the name of the function and the parameters it takes, and it must include delimiters that allow us to parse and execute the response for those parameters programmatically. _For instance, you can prompt the model to only return responses in JSON and then use built-in Python libraries to parse the stringified JSON._

Recently, it became even easier to use this type of method as well. In late June, OpenAI released **gpt-4-0613** and **gpt-3.5-turbo-16k-0613** (whew, these names are getting long). They natively support function calls by using a model fine-tuned for JSON to return easy-to-use function calls. You can read more about it [here](https://platform.openai.com/docs/guides/gpt/function-calling).

## The future of LLM-powered agents is bright!

Large language models have been one of the most significant advances of the past decade. Capable of reasoning and talking like a human, they appear to be able to do anything. Despite this, several engineering challenges arise in building around an LLM, such as context limits, reasoning, and long-term retention.

Using the methods described above, **AgentGPT** unlocks the full potential of powerful models such as GPT-4. _We can give any model superpowers using novel prompting methods, efficient vector databases, and abundant API tools_. It's only the start, and we hope you'll join us on this journey.

## Conclusion

AgentGPT represents a powerful approach to building AI agents that reason, remember, and perform. By leveraging prompt
engineering, vector databases, and API tools, we can overcome the limitations of standalone LLMs and create agents that
demonstrate agentic behavior.

With the ability to reason, plan, and reflect, AgentGPT agents can tackle complex tasks and interact with the
environment in a meaningful way. By incorporating long-term memory through vector databases and utilizing APIs, we
provide agents with access to a vast pool of knowledge and resources.

AgentGPT is a step towards unlocking the full potential of LLMs and creating intelligent agents that can assist and
collaborate with humans in various domains. The combination of language models, prompt engineering, external memory,
and API interactions opens up exciting possibilities for AI agents in the future.

## Extra Resources

Are you interested in learning more about prompt engineering? We encourage you to check out other informational posts on our site, or you can check out the fantastic places below, or if you are interested in contributing, check out our [GitHub repo](https://github.com/reworkd/AgentGPT).
