import {
  createModel,
  extractArray,
  realTasksFilter,
  startGoalAgent,
} from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal } = (await request.json()) as RequestBody;
    const completion = await startGoalAgent(createModel(modelSettings), goal);

    const newTasks = extractArray(completion.text as string).filter(
      realTasksFilter
    );
    return NextResponse.json({ newTasks });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
