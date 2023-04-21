import { NextApiHandler } from "next";
import { randomBytes } from "crypto";
import { serialize } from "cookie";

const TOKEN_NAME = "XSRF-TOKEN";
const TOKEN_LENGTH = 32;

const generateToken = () => randomBytes(TOKEN_LENGTH).toString("base64");

const handler: NextApiHandler = (req, res) => {
  const csrfToken = generateToken();
  const maxAge = 60 * 60 * 24; // 1 day
  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    maxAge,
    path: "/",
  };

  res.setHeader("Set-Cookie", serialize(TOKEN_NAME, csrfToken, cookieOptions));
  res.status(200).json({ csrfToken });
};

export default handler;
