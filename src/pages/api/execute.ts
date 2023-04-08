import { executeTaskAgent } from "../../utils/chain";
import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";

export interface ExecuteAPIRequest extends NextApiRequest {
  body: {
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
  const completion = await executeTaskAgent(req.body.goal, req.body.task);
  console.log(completion.text);
  res.status(200).json({ response: completion.text as string });
}
