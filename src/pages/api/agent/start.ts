import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { serverError } from "../responses";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal, language } = (await request.json()) as RequestBody;
    const newTasks = await AgentService.startGoalAgent(modelSettings, goal, language);
    return NextResponse.json({ newTasks });
  } catch (e) {}

  return serverError();
};

export default handler;
