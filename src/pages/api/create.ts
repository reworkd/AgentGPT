import {
  createModel,
  executeCreateTaskAgent,
  extractArray,
  realTasksFilter,
} from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

interface RequestBody {
  customApiKey: string;
  customModelName: string;
  goal: string;
  tasks: string[];
  lastTask: string;
  result: string;
}

const handler = async (request: NextRequest) => {
  try {
    const { customApiKey, customModelName, goal, tasks, lastTask, result } =
      (await request.json()) as RequestBody;
    const completion = await executeCreateTaskAgent(
      createModel({ customApiKey, customModelName }),
      goal,
      tasks,
      lastTask,
      result
    );

    const newTasks = extractArray(completion.text as string).filter(
      realTasksFilter
    );
    return NextResponse.json({ newTasks });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
