import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";
import { createAgent } from "../../services/agent-service";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  try {
    const { modelSettings, goal, tasks, lastTask, result, completedTasks } =
      (await request.json()) as RequestBody;

    if (tasks === undefined || lastTask === undefined || result === undefined) {
      return;
    }

    const newTasks = await createAgent(
      modelSettings,
      goal,
      tasks,
      lastTask,
      result,
      completedTasks
    ); // Remove duplicates

    return NextResponse.json({ newTasks });
  } catch (e) {}

  return NextResponse.error();
};

export default handler;
