---
title: "Adam W"
description: "Adam dates crystal ball chicks with a deep understanding of cutting-edge technologies. He leads the technical team and drives innovation in the development of high-performance web applications. Adam is passionate about leveraging technology to solve complex problems and deliver exceptional user experiences."
imageUrl: "https://images.unsplash.com/photo-1688895061992-a842b5056e75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
date: "Feb 20, 2023"
datetime: "2023-02-20"
category:
  title: "Tech"
  href: "#"
author:
  name: "Adam Johnson"
  role: "CTO / Co-Founder"
  href: "#"
  imageUrl: "https://images.unsplash.com/photo-1557683316-e10201644e2b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3600&q=80"
---

# Understanding AgentGPT: How we build AI agents that reason, remember, and perform.

![CybrCo_Art_human-like_robot_typing_on_a_computer_in_a_dark_room_a0174b88-a5b9-4b82-98c6-734dbbde8d09.webp](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fef520689-ca1b-4489-98aa-41136f565840%2FCybrCo_Art_human-like_robot_typing_on_a_computer_in_a_dark_room_a0174b88-a5b9-4b82-98c6-734dbbde8d09.webp?id=f768fec9-bd6a-43ae-811d-1adb065c6c8e&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=2000&userId=&cache=v2)

_Alt: A robotic agent types at a laptop in a dark room._

---

The invention of the **Generative Pre-trained Transformer (GPT)** is one of the recent decade's most important advancements in AI technology. The GPTs powering today's **Large Language Models (LLMs)** demonstrate a _remarkable ability for reasoning, understanding, and planning_. However, their true potential has yet to be fully realized.

At **Reworkd**, we believe that the _true power of LLMs lies in agentic behavior_. By engineering a system that draws on LLMs' emergent abilities and providing an ecosystem that supports environmental interactions, we can draw out the full potential of models like GPT-4. Here's how AgentGPT works.

## LLMs have a lot of limitations. 🧐

The main products shipping LLMs are chatbots powered by **[foundational models](https://www.techopedia.com/definition/34826/foundation-model#:~:text=Today%2C%20foundational%20models%20are%20used%20to%20train%20artificial,language%20processing%20%28NLP%29%20and%20natural%20language%20generation%20%28NLG%29.)** like ChatGPT, GPT-4, Claude, etc. These chat interfaces send user messages to the LLM and display completions.

If you have any familiarity working with OpenAI's API, a common formula you might use for chatting with the model may include:

- Taking the user's message.
- Adding a list of chat histories.
- Sending the chat history across the API to retrieve a completion.

This method works fine when the scope of conversations is small; however, _as you continue adding new messages to the chat history, the size and complexity of completions balloons_, and you will quickly run into a wall: the dreaded context limit.

A **context limit** is the maximum number of **tokens** (a token usually represents a single word) that can be input into the model for a single response. They are necessary because the _computational cost as we add additional tokens tends to increase quadratically_. However, they are often the bane of prompt engineers.

One solution is to measure the number of tokens in the chat history before sending it to the model and removing old messages to ensure it fits the token limit. While this approach works, it ultimately reduces the amount of knowledge available to the assistant.

Another issue that standalone LLMs face is the need for human guidance. Fundamentally, LLMs are next-word predictors, and often, their internal structure is not inherently suited to higher-order thought processes, such as **reasoning** through complex tasks. This weakness doesn't mean they can't or don't reason. In fact, there are several [studies](https://arxiv.org/abs/2205.11916#:~:text=While%20these%20successes%20are%20often%20attributed%20to%20LLMs%27,%22Let%27s%20think%20step%20by%20step%22%20before%20each%20answer.) that shows they can. However, it does mean they face certain impediments. For example, the LLM itself can create a logical list of steps; however, it has _no built-in mechanisms for observation and reflection on that list._

A pre-trained model is essentially a "black box" for the end user in which the final product that is shipped has _limited to no capability of actively updating its knowledge base and tends to act in unpredictable ways_. As a result, it's [hallucination](https://arxiv.org/abs/2202.03629)-prone.

Thus, it requires a lot of effort on the user's part to guide the model's output, and prompting the LLM itself becomes a job on its own. This extra work is a far cry from our vision of an AI-powered future.

By providing a platform to give LLMs agentic abilities, _AgentGPT aims to overcome the limitations of standalone LLMs by leveraging prompt engineering techniques, vector databases, and API tooling._ Here’s some interesting work that is being done with the agent concept:

[https://twitter.com/DrJimFan/status/1673006745067847683](https://twitter.com/DrJimFan/status/1673006745067847683)

## What are agents? 🥷

In a general sense, [agents](https://zapier.com/blog/ai-agent/) are rational actors. They use thinking and reasoning to influence their environment. _This could be in the form of solving problems or pursuing specific goals. They might interact with humans or utilize tools._ Ultimately, we can apply this concept to LLMs to instill more intelligent and logical behavior.

In AgentGPT, large language models essentially function as the **brain** of each agent. As a result, we can produce powerful agents by cleverly _manipulating the English language_ and engineering a _framework that supports interoperability between LLM completions and a diverse set of APIs_.

### Engineering this system consists of 3 parts.

**Reasoning and Planning.** If you were to simply take a general goal, such as "build a scaling e-commerce platform," and give it to ChatGPT, you would likely get a response along the lines of "As an AI language model…." However, through **prompt engineering**, we can get a model to _break down goals into digestible steps and reflect on them_ with a method called chain of thought prompting.

**Memory.** When dealing with memory, we divide the problem into **short-term** and **long-term**. In managing short-term memory, we can use prompting techniques such as _few-shot prompting to steer LLM responses_. However, _cost and context limits make it tricky to generate completions without limiting the breadth of information_ a model can use to make decisions.

Similarly, this issue also arises in **long-term memory** because it would be impossible to provide an appropriate corpus of writing to bridge the gap between GPT -4's cutoff date, 2021, till today. By using vector databases, we attempt to overcome this using specialized models for _information retrieval in high-dimensional vector spaces._

**Tools**. Another challenge in using LLMs as general actors is their confinement to text outputs. Again, we can use prompt engineering techniques to solve this issue. We can generate predictable function calls from the LLM through few-shot and chain-of-thought methods, utilizing API tools like **Google Search**, **Hugging Face**, **Dall-E**, etc. In addition, we can use fine-tuned LLMs that only return responses in specialized formatting, like JSON. This is the approach OpenAI took when they recently released the function calling feature for their API.

These three concepts have formed the backbone of multiple successful agent-based LLM platforms such as [Microsoft Jarvis](https://github.com/microsoft/JARVIS), [AutoGPT](https://github.com/Significant-Gravitas/Auto-GPT), [BabyAGI](https://github.com/yoheinakajima/babyagi), and of course, AgentGPT. With this brief overview in mind, let's dive deeper into each component.

## How do we get agents to act intelligently? 🧠

**Prompt engineering** has become highly popularized, and it's only natural given its ability to _increase the reliability of LLM responses_, opening a wide avenue of potential applications for generative AI. AgentGPT's ability to think and reason is a result of novel prompting methods.

### A Brief Intro to Prompt Engineering

Prompt engineering is a largely empirical field that aims to find methods to steer LLM responses by finding clever ways to use the English language. _You can think of it like lawyering, where every nuance in the wording of a prompt counts._

These are the main concepts and building blocks for more advanced prompting techniques:

1. **Zero-Shot** involves sending the raw command directly to the LLM with little to no formatting.
2. **Few-Shot** gives context for completions in the form of example responses.
3. **Chain-of-Thought** guides the model in reasoning through generating and reasoning over a complex task.

### How AgentGPT Uses Prompt Engineering

AgentGPT uses an advanced form of chain-of-thought prompting called **Plan-and-Solve** to generate the steps you see when operating the agents.

Traditionally, chain-of-thought prompting utilized few-shot techniques to provide examples of a thinking and reasoning process. However, as is becomes a theme, it becomes more costly as the complexity of a task increases because we will need to provide more context.

**Plan-and-solve (PS):** By virtue of being a zero-shot method, it provides a _prompting framework for LLM-guided reasoning using "trigger" words_. These keywords trigger a reasoning response from the model.

We can expand on this concept by _modifying the prompt to extract important variables and steps to generate a final response with a cohesive format_. This method allows us to parse the final response and display it for the end user as well as feed sub-steps into future plan-and-solve prompts.

![Screen Shot 2023-07-01 at 12.25.37 PM.png](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7273dc94-0e43-42c5-ba8f-aeaf4ddc944a%2FScreen_Shot_2023-07-01_at_12.25.37_PM.png?id=af381437-ef8f-47d6-942b-8ef459af453e&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=800&userId=&cache=v2)

_Alt: An example of Plan-and-Solve prompting that extracts variables from a reasoned response using trigger keywords._

**\*\*\*\***\***\*\*\*\***Caption: Example of a Plan-and-Solve prompt courtesy of this paper:**\*\*\*\***\***\*\*\*\*** [_Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models_](https://arxiv.org/abs/2305.04091)

While PS prompting helps evoke a reasoning response, it still misses a fundamental concept in reasoning, and that is proper handling for reflection and action. **Reflection** is _fundamental for any agent because it must rationalize an action, perform that action, and use feedback to adjust future actions._ Without it, the agent would be stateless and unchanging.

AgentGPT uses a prompting framework called Reasoning and Acting ([ReAct](https://arxiv.org/pdf/2210.03629.pdf)) to expand on the capabilities of the Plan-and-Solve concept. **ReAct** aims to _enable a framework for the model to access fresh knowledge through external knowledge bases and make observations of actions it has taken_. Using those observations, the LLM can make educated decisions on the next set of steps to complete while performing actions to query knowledge bases such as **Google Search** or **Wikipedia API**.

Prompt engineering is largely effective in resolving challenges in short-term memory as well as instilling the reasoning behavior that you can see when AgentGPT is at work. However, prompt engineering does not resolve the issue of long-term memory. This issue is where vector databases come in, and we will look at those next.

![Screen Shot 2023-07-03 at 3.12.56 AM.png](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7daa5245-cd1b-44d6-9b6b-71741f9ac6c3%2FScreen_Shot_2023-07-03_at_3.12.56_AM.png?id=4864c843-3dca-4046-9a08-8a8328db98b0&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=800&userId=&cache=v2)

**\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***Alt: An example of the ReAct prompt framework demonstrates that we can get an LLM to respond with a thought, an action, and an observation or reflection.**\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***

\***\*\*\*\***Caption: The ReAct framework allows us to generate a reasoning response, an action, and a reflection to steer the model’s response. This example is courtesy of the following paper: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)\*

## How do we give agents a working memory? 🚀

While we have seen that _prompt engineering is largely effective in resolving issues with short-term memory and reasoning_, we cannot solve long-term memory solely through clever English. Since we are not allowed to update the model to learn our data, we must build an external system for storing and retrieving knowledge.

A clever solution might use an LLM to _generate summaries of previous conversations as context for the prompt_. However, there are three significant issues with this. First, we are diluting the relevant information for the conversation; second, it introduces another cost area by paying for API usage for those summaries; and third, it's unscalable.

Thus, prompts appear to be ineffective for long-term memory. Seeing as _long-term memory is a problem of storage and efficient retrieval of information_, there is no absence of research in the study of search, so we must look towards vector databases.

### Vector Databases Demystified

**[Vector databases](https://aws.amazon.com/what-is/vector-databases/)** have been hyped up for a while now, and the hype is very deserved. They are an efficient way of storing and retrieving vectors by allowing us to use some fun new _algorithms to query billions - even trillions - of data records in milliseconds._

Let's start with a little bit of vocabulary:

- A **vector** in the context of an LLM is a representation of a piece of text that a model like GPT-4 encodes.
- A **vector space** contains many of these vectors.
- An **embedding** is the vectorized version of a text.

Vector libraries like **[Facebook AI Similarity Search](https://www.bing.com/ck/a?!&&p=a0f4167bc6cd7db9JmltdHM9MTY4ODM0MjQwMCZpZ3VpZD0zOTYwYjczZS1hNzg2LTY5Y2MtMjM2YS1hNDdmYTYwMjY4MjImaW5zaWQ9NTIwMQ&ptn=3&hsh=3&fclid=3960b73e-a786-69cc-236a-a47fa6026822&psq=faiss+github&u=a1aHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rcmVzZWFyY2gvZmFpc3M&ntb=1) (FAISS)** give us access to valuable _tools to control these vectors and locate them efficiently in the vector space._

Since the text is in a numerical embedding dictated by the model type (i.e., text-embedding-ada-002), there is some location in space that the text exists in, and it's based on the numbers that compose its vector. That means _similar texts will be represented as vectors with similar numbers, and thus, they will likely be grouped closely. On the other hand, less similar texts will be further away_. For example, texts about cooking will be closer to food than texts about physics.

There are several different algorithms for querying the vector space, but the most relevant to this discussion is the cosine similarity search. **[Cosine similarity](https://www.geeksforgeeks.org/cosine-similarity/)** measures the cosine of the angle between two non-zero vectors. _It is a measure of orientation, meaning that it's used to determine how similar two documents (or whatever the vectors represent) are_. Cosine similarity can range from -1 to 1, with -1 meaning the vectors are diametrically opposed (completely opposite), 0 meaning the vectors are orthogonal (or unrelated), and 1 meaning the vectors are identical.

FAISS is helpful in managing these vector spaces, but it is not a database. _Vector libraries lack [CRUD](https://www.freecodecamp.org/news/crud-operations-explained/) operations, which makes them alone unviable for long-term memory_, and that's where cloud services such as Pinecone and Weaviate step in.

**Pinecone** and **Weaviate** essentially do all the hard work of managing our vectors. They provide an API that allows you to upload embeddings, perform various types of searches, and store those vectors for later. _They provide the typical CRUD functions we need to instill memory into LLMs in easily-accessible Python modules._

By using them, we can encode large amounts of information for future storage and retrieval. For instance, when the LLM needs extra knowledge to complete a task, we can prompt it to query the vector space to find relevant information. Thus, we can create long-term memory.

![CybrCo_Art_A_human-like_robot_touching_a_flower_for_the_first_t_92e97d56-54fa-4bb0-8581-5a1e15fd94aa.webp](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F246f8a03-aa3a-4f53-b16f-090699dedf80%2FCybrCo_Art_A_human-like_robot_touching_a_flower_for_the_first_t_92e97d56-54fa-4bb0-8581-5a1e15fd94aa.webp?id=ec8c4626-8909-4b32-83a1-8e9e66715c97&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=1000&userId=&cache=v2)

**\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***Alt: An image of a robotic hand gently touching a flower.\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***

## Providing tools for real-world actions 🛠️

The last major obstacle for creating agentic LLMs is the limitation of working purely with text. While we can utilize prompt engineering to simulate function calls and manipulate text, _an agent must be capable of interacting with the real world_ to perform tasks or provide meaningful assistance.

To enable this real-world interaction, we can leverage various APIs and external tools that provide specific functionality beyond text generation.

Some popular tools and APIs that can be integrated with AgentGPT to expand its capabilities include:

- **Google Search API**: Allows the agent to perform web searches and retrieve information from the internet.
- **Hugging Face**: Provides a library of pre-trained models for various NLP tasks, such as sentiment analysis, text classification, and question-answering.
- **Dall-E**: Enables the generation of images from textual descriptions.
- **Wikipedia API**: Allows access to Wikipedia articles and information.
- **Database APIs**: Provide access to external databases for storing and retrieving information.

By integrating these tools and APIs into AgentGPT, we can enhance its ability to perform a wide range of real-world tasks, provide accurate information, and generate relevant outputs beyond text.

## Conclusion

AgentGPT represents a significant step forward in leveraging the capabilities of large language models like GPT-4. By incorporating agentic behavior through prompt engineering, memory management using vector databases, and integration with external tools and APIs, we can create intelligent agents that reason, remember, and perform real-world actions.

While there are still challenges to overcome, such as context limits, cost constraints, and the need for human guidance, AgentGPT opens up exciting possibilities for AI-powered assistants, problem solvers, and decision makers. As researchers and engineers continue to refine and expand the capabilities of AgentGPT, we can look forward to a future where AI agents contribute meaningfully to our daily lives and help us navigate complex tasks with ease.

![CybrCo_Logo_Small.png](https://petal-diplodocus-04a.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc4da9e3c-1da4-4ad6-8751-b0b3b30c2048%2FCybrCo_Logo_Small.png?id=a9f6da2c-9d22-42ad-8917-1f56ad1251d0&table=block&spaceId=46c3481b-d8de-4c34-8647-2292d63a5f29&width=500&userId=&cache=v2)

_Alt: The CybrCo logo._

_About the Author: Adam Johnson is the CTO and Co-Founder of CybrCo, a leading technology company specializing in AI and web application development. With a passion for leveraging cutting-edge technologies to solve complex problems, Adam leads CybrCo's technical team and drives innovation in high-performance web applications. In his free time, he enjoys exploring the latest advancements in AI and contributing to the AI research community._

_Image credits:_

- _Featured image: [Unsplash](https://unsplash.com/photos/TOoYECb4zNQ)_
- _Author image: [Unsplash](https://unsplash.com/photos/b8K8P6GvFj0)_
- _ReAct prompt framework: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)_
- _Pinecone and Weaviate logos: [Pinecone](https://www.pinecone.io/) and [Weaviate](https://www.semi.technology/product/weaviate.html)_
- _CybrCo logo: [CybrCo](https://www.cybrco.com/)_
