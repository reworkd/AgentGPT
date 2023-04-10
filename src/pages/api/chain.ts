import type { NextApiRequest, NextApiResponse } from "next";
import { extractArray, startGoalAgent } from "../../utils/chain";

export interface ChainAPIRequest extends NextApiRequest {
  body: {
    goal: string;
  };
}

export interface ChainAPIResponse extends NextApiResponse {
  body: { tasks: string[] };
}

export default async function handler(
  req: ChainAPIRequest,
  res: ChainAPIResponse
) {
  const completion = await startGoalAgent(req.body.goal);
  console.log(completion.text);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  res.status(200).json({ tasks: extractArray(completion.text) });
}
