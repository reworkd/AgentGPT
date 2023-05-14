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
    const { modelSettings, goal, task } = body;
    if (task === undefined) {
      return;
    }

    const response = await withFallback("analyze", body, () =>
      AgentService.analyzeTaskAgent(modelSettings, goal, task)
    );

    return NextResponse.json(response);
  } catch (e) {}

  return serverError();
};

export default handler;
