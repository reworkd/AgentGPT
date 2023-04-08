import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()",
  inputVariables: ["goal"],
});
export const startGoalAgent = async (goal: string) => {
  return await new LLMChain({ llm: model, prompt: startGoalPrompt }).call({
    goal,
  });
};

const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task"],
});
export const executeTaskAgent = async (goal: string, task: string) => {
  return await new LLMChain({ llm: model, prompt: executeTaskPrompt }).call({
    goal,
    task,
  });
};

const createTaskPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
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
