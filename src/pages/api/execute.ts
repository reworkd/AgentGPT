import { createModel, executeTaskAgent } from "../../utils/chain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal, task } = (await request.json()) as RequestBody;

    if (task === undefined) {
      return;
    }

    const completion = await executeTaskAgent(
      createModel(modelSettings),
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
