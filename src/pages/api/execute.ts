import { createModel, executeTaskAgent } from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RequestBody {
  customApiKey: string;
  goal: string;
  task: string;
}
export const config = {
  runtime: "edge",
};

export default async (request: NextRequest) => {
  let data: RequestBody | null = null;
  try {
    data = (await request.json()) as RequestBody;
    const completion = await executeTaskAgent(
      createModel(data.customApiKey),
      data.goal,
      data.task
    );

    return NextResponse.json({
      response: completion.text as string,
    });
  } catch (e) {}

  return NextResponse.error();
};
