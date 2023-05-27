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
    const { modelSettings, goal, language, tasks, lastTask, result, completedTasks } = body;

    if (tasks === undefined || lastTask === undefined || result === undefined) {
      return;
    }

    const newTasks = await withFallback("create", body, () =>
      AgentService.createTasksAgent(
        modelSettings,
        goal,
        language,
        tasks,
        lastTask,
        result,
        completedTasks
      )
    );

    return NextResponse.json(newTasks);
  } catch (e) {}

  return serverError();
};

export default handler;
