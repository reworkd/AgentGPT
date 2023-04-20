import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

export const createModel = (settings: ModelSettings) =>
  new OpenAI({
    openAIApiKey:
      settings.customApiKey === ""
        ? process.env.OPENAI_API_KEY
        : settings.customApiKey,
    temperature: settings.customTemperature || 0.9,
    modelName:
      settings.customModelName === "" ? GPT_35_TURBO : settings.customModelName,
    maxTokens: 400,
  });

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective: `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Use the `{customLanguage}` language and respond only with the Array which has the following syntax:`[1...3 tasks on the given language]`",
  inputVariables: ["goal", "customLanguage"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective: `{goal}`, and the following task: `{task}`.  You have to use the `{customLanguage}` language. Execute the given task and respond only with a one-line text as solution for the given task on the given language..",
  inputVariables: ["goal", "task", "customLanguage"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
  "You are an AI task creation agent and your objective  is to `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following solution `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Use the `{customLanguage}` language to create the new task. Respond only with an Array of the new task or tasks which has the following syntax:`[the remaining and appropriate new task or tasks on the language you have to use]`",
  inputVariables: ["goal", "tasks", "lastTask", "result", "customLanguage"],
});
