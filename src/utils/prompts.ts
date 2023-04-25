import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

export const createModel = (settings: ModelSettings) => {
  let _settings: ModelSettings | undefined = settings;
  if (!settings.customModelName) {
    _settings = undefined;
  }

  return new OpenAI({
    openAIApiKey: _settings?.customApiKey || process.env.OPENAI_API_KEY,
    temperature: _settings?.customTemperature || 0.7,
    modelName: _settings?.customModelName || GPT_35_TURBO,
    maxTokens: _settings?.maxTokens || 400,
  });
};

export const startGoalPrompt = new PromptTemplate({
  template: `You are an autonomous task creation AI called AgentGPT. You have access to google search for current events for small searches. You have the following objective "{goal}". Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse(). Example: ["Research new marketing designs", "Create a campaign"]`,
  inputVariables: ["goal"],
});

export const analyzeTaskPrompt = new PromptTemplate({
  template: `You have the following objective "{goal}". You have the following tasks "{task}". Based on this information, evaluate what the best action to take is strictly from the list of actions: {actions}. You should use 'search' only for research about current events where arg is a simple clear search query. Use "reason" for all other actions. Return the response as an object of the form {{ "action": "string", "arg": "string" }} that can be used in JSON.parse() and NOTHING ELSE.`,
  inputVariables: ["goal", "actions", "task"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE.",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});

export const summarizeSearchSnippets = new PromptTemplate({
  template: `Summarize the following snippets "{snippets}" from google search results filling in information where necessary. This summary should answer the following query: "{query}". Return the summary as a string. Do not show you are summarizing.`,
  inputVariables: ["query", "snippets"],
});
