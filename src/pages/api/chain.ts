import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";
import { startAgent } from "../../services/agent-service";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal } = (await request.json()) as RequestBody;
    const newTasks = await startAgent(modelSettings, goal);
    return NextResponse.json({ newTasks });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
