import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9, modelName: 'gpt-3.5-turbo' });

const startGoalPrompt = new PromptTemplate({
  template: "You are an autonomous task creation AI called Agent-GPT. You have the following objective `{goal}`. Create a list of one to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()",
  inputVariables: ["goal"],
});

export const startGoalAgent = async (goal: string) => {
  return await new LLMChain({ llm: model, prompt: startGoalPrompt }).call({ goal });
}