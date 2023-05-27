import type {NextApiRequest, NextApiResponse,} from "next";
import type {AuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {getCookie, setCookie} from "cookies-next";
import {z} from "zod";
import {v4} from "uuid";
import type {IncomingMessage, ServerResponse} from "http";
import type {Adapter} from "next-auth/adapters";

const monthFromNow = () => {
  const now = new Date(Date.now());
  return new Date(now.setMonth(now.getMonth() + 1));
};

function cookieToString(cookie: string | undefined | null | boolean) {
  switch (typeof cookie) {
    case "boolean":
      return cookie.toString();
    case "string":
      return cookie;
    default:
      return "";
  }
}

export const options = (
  adapter: Adapter,
  req: NextApiRequest | IncomingMessage,
  res: NextApiResponse | ServerResponse
): AuthOptions => {
  return {
    adapter,
    providers: [
      Credentials({
        name: "Username, Development Only (Insecure)",
        credentials: {
          name: {label: "Username", type: "text"},
        },
        async authorize(credentials, req) {
          if (!credentials) return null;

          const creds = z
            .object({
              name: z.string().min(1),
            })
            .parse(credentials);

          const user = await adapter.getUserByEmail(creds.name);
          if (user) return user;

          return adapter.createUser({
            name: creds.name,
            email: creds.name,
            image: undefined,
            emailVerified: null,
          });
        },
      }),
    ],
    callbacks: {
      async signIn({ user }) {
        if (user) {
          const session = (await adapter.createSession({
            sessionToken: v4(),
            userId: user.id,
            expires: monthFromNow(),
          }));

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          setCookie("next-auth.session-token", session.sessionToken, {
            expires: session.expires,
            req: req,
            res: res,
          });
        }

        return true;
      },
    },
    jwt: {
      encode: () => {
        const cookie = getCookie("next-auth.session-token", {
          req: req,
          res: res,
        });

        return cookieToString(cookie);
      },
      decode: () => {
        return null;
      },
    },
  };
};
