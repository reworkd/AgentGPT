import type { NextApiRequest, NextApiResponse } from "next";
import { createModel, extractArray, startGoalAgent } from "../../utils/chain";

export const config = {
  runtime: "edge",
};
export interface ChainAPIRequest extends NextApiRequest {
  body: {
    customApiKey: string;
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
  const model = createModel(req.body.customApiKey);
  const completion = await startGoalAgent(model, req.body.goal);
  console.log(completion.text);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  res.status(200).json({ tasks: extractArray(completion.text) });
}
