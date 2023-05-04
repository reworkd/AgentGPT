import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { AuthOptions } from "next-auth";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { CookieValueTypes } from "cookies-next";
import { getCookie, setCookie } from "cookies-next";
import { prisma } from "./db";
import { serverEnv } from "../env/schema.mjs";
import { z } from "zod";
import { v4 } from "uuid";
import type { AdapterSession } from "next-auth/src/adapters";

const adapter = PrismaAdapter(prisma);

const monthFromNow = () => {
  const now = new Date(Date.now());
  return new Date(now.setMonth(now.getMonth() + 1));
};

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/

const providers = [
  GoogleProvider({
    clientId: serverEnv.GOOGLE_CLIENT_ID ?? "",
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  GithubProvider({
    clientId: serverEnv.GITHUB_CLIENT_ID ?? "",
    clientSecret: serverEnv.GITHUB_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  DiscordProvider({
    clientId: serverEnv.DISCORD_CLIENT_ID ?? "",
    clientSecret: serverEnv.DISCORD_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  Credentials({
    name: "Development Only (Insecure)",
    credentials: {
      name: { label: "name", type: "text" },
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
        role: undefined,
        subscriptionId: undefined,
        emailVerified: null,
      });
    },
  }),
];
/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/

const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.subscriptionId = user.subscriptionId;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: providers,
  theme: {
    colorScheme: "dark",
    logo: "https://agentgpt.reworkd.ai/logo-white.svg",
  },
};

export const options = (
  req: NextApiRequest,
  res: NextApiResponse
): AuthOptions => {
  return {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async signIn({ user }) {
        if (user) {
          const session = (await adapter.createSession({
            sessionToken: v4(),
            userId: user.id,
            expires: monthFromNow(),
          })) as AdapterSession;

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
      encode: async ({ token, secret, maxAge }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const cookie = getCookie("next-auth.session-token", {
          req: req,
          res: res,
        }) as CookieValueTypes;

        switch (typeof cookie) {
          case "boolean":
            return cookie.toString();
          case "string":
            return cookie;
          default:
            return "";
        }
      },
      decode: ({ token, secret }) => {
        return null;
      },
    },
  };
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
