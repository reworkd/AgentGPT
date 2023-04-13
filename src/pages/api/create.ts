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
  goal: string;
  tasks: string[];
  lastTask: string;
  result: string;
}

export default async (request: NextRequest) => {
  let data: RequestBody | null = null;
  try {
    data = (await request.json()) as RequestBody;
    const completion = await executeCreateTaskAgent(
      createModel(data.customApiKey),
      data.goal,
      data.tasks,
      data.lastTask,
      data.result
    );

    const tasks = extractArray(completion.text as string).filter(
      realTasksFilter
    );
    return NextResponse.json({ tasks });
  } catch (e) {}

  return NextResponse.error();
};
