import type { NextApiRequest, NextApiResponse } from "next";

export interface ServerSettingsAPIRequest extends NextApiRequest {
  body: Record<string, never>;
}

export interface ServerSettingsAPIResponse extends NextApiResponse {
  body: {
    settings: Record<string, unknown>;
    };
}

export default function handler(
  req: ServerSettingsAPIRequest,
  res: ServerSettingsAPIResponse
) {
    const settings = {
        "MAX_LOOPS": process.env.MAX_LOOPS ? Number(process.env.MAX_LOOPS) : 4,
    };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  res.status(200).json({ settings });
}
