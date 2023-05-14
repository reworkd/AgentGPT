import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { serverError } from "../responses";
import { withFallback } from "./apiUtils";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as RequestBody;
    const { modelSettings, goal, language } = body;
    const newTasks = await withFallback("start", body, () =>
      AgentService.startGoalAgent(modelSettings, goal, language)
    );
    return NextResponse.json(newTasks);
  } catch (e) {}

  return serverError();
};

export default handler;
