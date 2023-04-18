import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
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
    maxTokens: 900,
  });

const startGoalPrompt = new PromptTemplate({
  template:
    "あなたは自律型タスク作成AIです。あなたには次の目的'{goal}'があります。目標により近く、あるいは完全に到達するような、0～3個のステップを実行順序を考慮して作成し、それを完了させてください。レスポンスはJSON.parse()とlang:jaで文字列の配列として返してください。",
  inputVariables: ["goal"],
});
export const startGoalAgent = async (model: OpenAI, goal: string) => {
  return await new LLMChain({
    llm: model,
    prompt: startGoalPrompt,
  }).call({
    goal,
  });
};

const executeTaskPrompt = new PromptTemplate({
  template:
    "あなたは自律型タスク実行AIです。あなたには次の目的`{goal}`を達成するために次のタスク `{task}` を持っています。このタスクの問題解決を実行し、lang:jaで返却してください。",
  inputVariables: ["goal", "task"],
});
export const executeTaskAgent = async (
  model: OpenAI,
  goal: string,
  task: string
) => {
  return await new LLMChain({ llm: model, prompt: executeTaskPrompt }).call({
    goal,
    task,
  });
};

const createTaskPrompt = new PromptTemplate({
  template:
    "あなたはAIタスク作成エージェントです。あなたには次の目的`{goal}`があります。次の未完了タスク `{tasks}` があり、タスク `{lastTask}` を実行し、次の結果 `{result}` を受け取ったところです。これらの情報に基づき、（タスク追加の必要があれば）さらに目標により近く、あるいは完全に到達するようなタスクをJSON.parse()とlang:jaで使用可能な文字列の配列として返却してください。NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});
export const executeCreateTaskAgent = async (
  model: OpenAI,
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

  console.warn("Error, could not extract array from inputString:", inputStr);
  return [];
};

// Model will return tasks such as "No tasks added". We should filter these
export const realTasksFilter = (input: string): boolean => {
  const noTaskRegex =
    /^No( (new|further|additional|extra|other))? tasks? (is )?(required|needed|added|created|inputted).*$/i;
  const taskCompleteRegex =
    /^Task (complete|completed|finished|done|over|success).*/i;
  const doNothingRegex = /^(\s*|Do nothing(\s.*)?)$/i;

  return (
    !noTaskRegex.test(input) &&
    !taskCompleteRegex.test(input) &&
    !doNothingRegex.test(input)
  );
};
