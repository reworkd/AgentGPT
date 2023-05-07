import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService, { DefaultAnalysis } from "../../../services/agent-service";
import { serverError } from "../responses";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal, language, task, analysis } =
      (await request.json()) as RequestBody;
    if (task === undefined) {
      return;
    }

    const response = await AgentService.executeTaskAgent(
      modelSettings,
      goal,
      language,
      task,
      analysis || DefaultAnalysis
    );
    return NextResponse.json({
      response: response,
    });
  } catch (e) {}

  return serverError();
};

export default handler;
