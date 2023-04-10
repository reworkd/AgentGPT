import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";
import { createModel, executeTaskAgent } from "../../utils/chain";

export interface ExecuteAPIRequest extends NextApiRequest {
  body: {
    customApiKey: string;
    goal: string;
    task: string;
  };
}

export interface ExecuteAPIResponse extends NextApiResponse {
  body: {
    response: string;
  };
}

export default async function handler(
  req: ExecuteAPIRequest,
  res: ExecuteAPIResponse
) {
  const completion = await executeTaskAgent(
    createModel(req.body.customApiKey),
    req.body.goal,
    req.body.task
  );
  console.log(completion.text);
  res.status(200).json({ response: completion.text as string });
}
