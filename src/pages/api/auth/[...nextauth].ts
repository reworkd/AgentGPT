import NextAuth from "next-auth";
import { options } from "../../../server/auth";
import type { NextApiRequest, NextApiResponse } from "next";

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  NextAuth(req, res, options(req, res));

export default auth;
