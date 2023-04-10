import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { randomUUID } from "crypto";

import { chroma, embeddingFunction } from "../server/db";

interface ContextResult {
  ids: string[];
  embeddings: number[][] | undefined;
  documents: string[];
  metadatas: object[];
  distances: number[];
}

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. " +
    "You have the following objective `{goal}`. " +
    "Create a list of zero to three tasks to be completed by your AI system such " +
    "that your goal is more closely reached or completely reached. " +
    "Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal"],
});
export const startGoalAgent = async (goal: string) => {
  const result = await new LLMChain({
    llm: model,
    prompt: startGoalPrompt,
  }).call({
    goal,
  });

  const text = JSON.parse(result.text as string) as string[];
  await saveContext(text, { task: goal });

  return result;
};

const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. " +
    "You have the following objective `{goal}`. " +
    "You have the following task `{task}`. " +
    "You have already completed the following tasks `{completedTasks}`. " +
    "Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "task", "context", "completedTasks"],
});
export const executeTaskAgent = async (goal: string, task: string) => {
  const context = await getContext(task);

  const result = await new LLMChain({
    llm: model,
    prompt: executeTaskPrompt,
  }).call({
    goal,
    task,
    completedTasks: context
      .map((c) => c.metadata.task)
      .join("[Task Separator]"),
  });

  await saveContext([task], { task });
  return result;
};

const createTaskPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. " +
    "You have the following incomplete tasks `{tasks}` " +
    "and have just executed the following task `{lastTask}` " +
    "and received the following result `{result}`. " +
    "Based on this, create a new task to be completed by your AI system " +
    "ONLY IF NEEDED such that your goal is more closely reached or completely reached. " +
    "Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});
export const executeCreateTaskAgent = async (
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string
) => {
  return await new LLMChain({ llm: model, prompt: createTaskPrompt }).call({
    goal,
    tasks,
    lastTask,
    result,
  });
};

const getContext = async (task: string) => {
  const collection = await chroma.getCollection("test", embeddingFunction);
  const vector = await embeddingFunction.generate([task]);
  const results = (await collection.query(vector, 5)) as ContextResult;

  return results.ids.map((id, i) => {
    return {
      id,
      document: results.documents[i],
      metadata: results.metadatas[i] as { task: string },
      distance: results.distances[i],
    };
  });
};

const saveContext = async (result: string[], meta: { task: string }) => {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments(result);

  const collection = await chroma.getCollection("test", embeddingFunction);
  await collection.add(
    docs.map(() => randomUUID()),
    undefined,
    docs.map(() => meta),
    docs.map((doc) => doc.pageContent)
  );
};

export const extractArray = (inputStr: string): string[] => {
  // Match an outer array of strings (including nested arrays)
  const regex = /(\[(?:\s*"(?:[^"\\]|\\.)*"\s*,?)+\s*\])/;
  const match = inputStr.match(regex);

  if (match && match[0]) {
    try {
      // Parse the matched string to get the array
      return JSON.parse(match[0]) as string[];
    } catch (error) {
      console.error("Error parsing the matched array:", error);
    }
  }

  console.error("Error, could not extract array from inputString:", inputStr);
  return [];
};
