import {
  createModel,
  executeCreateTaskAgent,
  executeTaskAgent,
  extractArray,
  realTasksFilter,
  startGoalAgent,
} from "../utils/chain";
import type { ModelSettings } from "../utils/types";
import { env } from "../env/client.mjs";

async function startAgent(modelSettings: ModelSettings, goal: string) {
  const completion = await startGoalAgent(createModel(modelSettings), goal);
  console.log(typeof completion.text);
  console.log("Completion:" + (completion.text as string));
  return extractArray(completion.text as string).filter(realTasksFilter);
}

async function createAgent(
  modelSettings: ModelSettings,
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string,
  completedTasks: string[] | undefined
) {
  const completion = await executeCreateTaskAgent(
    createModel(modelSettings),
    goal,
    tasks,
    lastTask,
    result
  );

  return extractArray(completion.text as string)
    .filter(realTasksFilter)
    .filter((task) => !(completedTasks || []).includes(task));
}

async function executeAgent(
  modelSettings: ModelSettings,
  goal: string,
  task: string
) {
  const completion = await executeTaskAgent(
    createModel(modelSettings),
    goal,
    task
  );
  return completion.text as string;
}

interface AgentService {
  startAgent: (modelSettings: ModelSettings, goal: string) => Promise<string[]>;
  createAgent: (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => Promise<string[]>;
  executeAgent: (
    modelSettings: ModelSettings,
    goal: string,
    task: string
  ) => Promise<string>;
}

const OpenAIAgentService: AgentService = {
  startAgent: startAgent,
  createAgent: createAgent,
  executeAgent: executeAgent,
};

const MockAgentService: AgentService = {
  startAgent: async (modelSettings, goal) => {
    return ["Task 1"];
  },
  createAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => {
    return ["Task 4"];
  },
  executeAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    task: string
  ) => {
    return "Result " + task;
  },
};

export default env.NEXT_PUBLIC_FF_MOCK_MODE_ENABLED
  ? MockAgentService
  : OpenAIAgentService;
