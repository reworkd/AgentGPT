import type { IncomingMessage, ServerResponse } from "http";

import { getCookie, setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { v4 } from "uuid";
import { z } from "zod";

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
          name: { label: "Username", type: "text" },
          superAdmin: { label: "SuperAdmin", type: "text" },
        },
        async authorize(credentials, req) {
          if (!credentials) return null;

          const creds = z
            .object({
              name: z.string().min(1),
              superAdmin: z.preprocess((str) => str === "true", z.boolean()).default(false),
            })
            .parse(credentials);

          const user = await adapter.getUserByEmail(creds.name);
          return user
            ? adapter.updateUser({
                id: user.id,
                name: creds.name,
                superAdmin: creds.superAdmin,
              })
            : adapter.createUser({
                name: creds.name,
                email: creds.name,
                image: undefined,
                emailVerified: null,
                superAdmin: false,
              } as AdapterUser);
        },
      }),
    ],
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      // Fallback to base url if provided url is not a subdirectory
      redirect: (params: { url: string; baseUrl: string }) =>
        params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl,

      async signIn({ user }) {
        if (user) {
          const session = await adapter.createSession({
            sessionToken: v4(),
            userId: user.id,
            expires: monthFromNow(),
          });

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
