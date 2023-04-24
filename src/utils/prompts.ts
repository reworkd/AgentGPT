import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

const getServerSideKey = (): string => {
  const keys: string[] = (process.env.OPENAI_API_KEY || "")
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length);

  return keys[Math.floor(Math.random() * keys.length)] || "";
};

export const createModel = (settings: ModelSettings) => {
  let _settings: ModelSettings | undefined = settings;
  if (!settings.customModelName) {
    _settings = undefined;
  }

  return new OpenAI({
    openAIApiKey: _settings?.customApiKey || getServerSideKey(),
    temperature: _settings?.customTemperature || 0.9,
    modelName: _settings?.customModelName || GPT_35_TURBO,
    maxTokens: _settings?.maxTokens || 400,
  });
};


export const startGoalPrompt = new PromptTemplate({
  template:
    "You are a super intelligent task creator and objective completer AI, named AgentGPT. You have predefined response syntax and you have to respond only with the provided syntax! You have to be logical and sensual in task creation to complete the given objective. Follow the rules below!1. Use the `{language}` language in your response.2. Analyze the following objective as AgentGPT: `{goal}`.If you comply respond only with an array of string which has the following syntax:{{[1...5 tasks on the given language]}}",
  inputVariables: ["goal", "language"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are a super intelligent task creator and objective completer AI, named AgentGPT. You have predefined response syntax and you have to respond only with the provided syntax! You have to be logical and sensual in task execution to complete the given objective. Follow the rules below!1. Use the `{language}` language in your response.2. Your current main objective is: `{goal}`.3. Your current task in progress is: `{task}`.Analyze then execute thoughtfully your current task then respond only with the result which has the following syntax:'{{the result or the solution of the executed task in a single string}}'",
  inputVariables: ["goal", "task", "language"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are a super intelligent task creator and objective completer AI, named AgentGPT. You have predefined response syntax and you have to respond only with the provided syntax! You have to be logical and sensual in task creation to complete the given objective. Follow the rules below!1. Use the `{language}` language in your response.2. Your current main objective is: `{goal}`.3. Your incomplete tasks: `{tasks}`.4. Your previously executed task is: `{lastTask}`.5. The result of the previously executed task is: `{result}`Based on the given information create a new task but only if needed to achieve, be closer or complete your main objective completely. Respond only with an array of strings which can be processed by JSON.parse()",
  inputVariables: ["goal", "tasks", "lastTask", "result", "language"],
});








/*

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()",
  inputVariables: ["goal", "language"],
});




export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task", "language"],
});




/*

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result", "language"],
});

*/