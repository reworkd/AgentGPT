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
  goal: string;
}

export default async (request: NextRequest) => {
  let data: RequestBody | null = null;
  try {
    data = (await request.json()) as RequestBody;
    const completion = await startGoalAgent(
      createModel(data.customApiKey),
      data.goal
    );

    const tasks = extractArray(completion.text as string).filter(
      realTasksFilter
    );
    return NextResponse.json({ tasks });
  } catch (e) {}

  return NextResponse.error();
};
