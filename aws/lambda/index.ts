import type {
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";

import { executeTaskAgent, createModel } from "./chain";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Body: ${event.body}`);
  console.log(`JSON: ${JSON.stringify(event.body, null, 2)}`);
  console.log(typeof event.body);

  const data = JSON.parse(event.body);
  const goal = data.goal;
  const task = data.task;
  const apiKey = data.customApiKey ?? "";

  console.log(data);
  console.log(goal);
  console.log(task);

  if (!goal || !task) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: "Missing goal or task",
      }),
    };
  }

  const model = createModel(apiKey);
  const completion = await executeTaskAgent(model, goal, task);

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: completion.text as string,
    }),
  };
};
