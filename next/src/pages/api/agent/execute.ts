import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService, { DefaultAnalysis } from "../../../services/agent-service";
import { serverError } from "../responses";
import { withFallback } from "./apiUtils";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as RequestBody;
    const { modelSettings, goal, language, task, analysis } = data;
    if (task === undefined) {
      return;
    }

    const response = await withFallback("execute", data, () =>
      AgentService.executeTaskAgent(
        modelSettings,
        goal,
        language,
        task,
        analysis || DefaultAnalysis
      )
    );
    return NextResponse.json(response);
  } catch (e) {}

  return serverError();
};

export default handler;
