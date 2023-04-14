import {
  createModel,
  extractArray,
  realTasksFilter,
  startGoalAgent,
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
}

const handler = async (request: NextRequest) => {
  try {
    const { customApiKey, customModelName, goal } =
      (await request.json()) as RequestBody;
    const completion = await startGoalAgent(
      createModel({ customApiKey, customModelName }),
      goal
    );

    const newTasks = extractArray(completion.text as string).filter(
      realTasksFilter
    );
    return NextResponse.json({ newTasks });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
