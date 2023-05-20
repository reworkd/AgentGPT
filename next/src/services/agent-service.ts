import {
  analyzeTaskPrompt,
  createModel,
  createTasksPrompt,
  executeTaskPrompt,
  startGoalPrompt
} from "../utils/prompts";
import type { ModelSettings } from "../utils/types";
import { env } from "../env/client.mjs";
import { LLMChain } from "langchain/chains";
import { extractTasks } from "../utils/helpers";
import { Serper } from "./custom-tools/serper";

async function startGoalAgent(modelSettings: ModelSettings, goal: string, language: string) {
  const completion = await new LLMChain({
    llm: createModel(modelSettings),
    prompt: startGoalPrompt,
  }).call({
    goal,
    language,
  });
  return {
    newTasks: extractTasks(completion.text as string, []),
  };
}

async function analyzeTaskAgent(modelSettings: ModelSettings, goal: string, task: string) {
  const actions = ["reason", "search"];
  const completion = await new LLMChain({
    llm: createModel(modelSettings),
    prompt: analyzeTaskPrompt,
  }).call({
    goal,
    actions,
    task,
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return JSON.parse(completion.text) as Analysis;
  } catch (e) {
    console.error("Error parsing analysis", e);
    // Default to reasoning
    return DefaultAnalysis;
  }
}

export type Analysis = {
  reasoning: string;
  action: "reason" | "search" | "wikipedia" | "image";
  arg: string;
};

export const DefaultAnalysis: Analysis = {
  reasoning: "DELETE ME!",
  action: "reason",
  arg: "Fallback due to parsing failure",
};

async function executeTaskAgent(
  modelSettings: ModelSettings,
  goal: string,
  language: string,
  task: string,
  analysis: Analysis
) {
  if (analysis.action == "search" && process.env.SERP_API_KEY) {
    return { response: await new Serper(modelSettings, goal)._call(analysis.arg) };
  }

  const completion = await new LLMChain({
    llm: createModel(modelSettings),
    prompt: executeTaskPrompt,
  }).call({
    goal,
    language,
    task,
  });

  // For local development when no SERP API Key provided
  if (analysis.action == "search" && !process.env.SERP_API_KEY) {
    return {
      response: `\`ERROR: Failed to search as no SERP_API_KEY is provided in ENV.\` \n\n${
        completion.text as string
      }`,
    };
  }

  return { response: completion.text as string };
}

async function createTasksAgent(
  modelSettings: ModelSettings,
  goal: string,
  language: string,
  tasks: string[],
  lastTask: string,
  result: string,
  completedTasks: string[] | undefined
) {
  const completion = await new LLMChain({
    llm: createModel(modelSettings),
    prompt: createTasksPrompt,
  }).call({
    goal,
    language,
    tasks,
    lastTask,
    result,
  });

  return {
    newTasks: extractTasks(completion.text as string, completedTasks || []),
  };
}

interface AgentService {
  startGoalAgent: (
    modelSettings: ModelSettings,
    goal: string,
    language: string
  ) => Promise<{ newTasks: string[] }>;
  analyzeTaskAgent: (modelSettings: ModelSettings, goal: string, task: string) => Promise<Analysis>;
  executeTaskAgent: (
    modelSettings: ModelSettings,
    goal: string,
    language: string,
    task: string,
    analysis: Analysis
  ) => Promise<{ response: string }>;
  createTasksAgent: (
    modelSettings: ModelSettings,
    goal: string,
    language: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => Promise<{ newTasks: string[] }>;
}

const OpenAIAgentService: AgentService = {
  startGoalAgent: startGoalAgent,
  analyzeTaskAgent: analyzeTaskAgent,
  executeTaskAgent: executeTaskAgent,
  createTasksAgent: createTasksAgent,
};

const MockAgentService: AgentService = {
  startGoalAgent: async (modelSettings, goal, language) => {
    return await new Promise((resolve) =>
      resolve({
        newTasks: ["Task 1"],
      })
    );
  },

  createTasksAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    language: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => {
    return await new Promise((resolve) => resolve({ newTasks: ["Task 4"] }));
  },

  analyzeTaskAgent: async (modelSettings: ModelSettings, goal: string, task: string) => {
    return await new Promise((resolve) =>
      resolve({
        reasoning: "Mock reasoning",
        action: "reason",
        arg: "Mock analysis",
      })
    );
  },

  executeTaskAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    language: string,
    task: string,
    analysis: Analysis
  ) => {
    return await new Promise((resolve) => resolve({ response: "Result: " + task }));
  },
};

export default env.NEXT_PUBLIC_FF_MOCK_MODE_ENABLED ? MockAgentService : OpenAIAgentService;
