import { createModel, executeTaskAgent } from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RequestBody {
  customApiKey: string;
  customModelName: string;
  goal: string;
  task: string;
}
export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { customApiKey, customModelName, goal, task } =
      (await request.json()) as RequestBody;
    const completion = await executeTaskAgent(
      createModel({ customApiKey, customModelName }),
      goal,
      task
    );

    return NextResponse.json({
      response: completion.text as string,
    });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
