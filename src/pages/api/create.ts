import {
  createModel,
  executeCreateTaskAgent,
  extractArray,
  realTasksFilter,
} from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal, tasks, lastTask, result } =
      (await request.json()) as RequestBody;

    if (tasks === undefined || lastTask === undefined || result === undefined) {
      return;
    }

    const completion = await executeCreateTaskAgent(
      createModel(modelSettings),
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
