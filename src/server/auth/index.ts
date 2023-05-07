import {authOptions as prodOptions} from "./auth";
import {options as devOptions} from "./local-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {AuthOptions} from "next-auth";
import merge from "lodash/merge";

import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import {IncomingMessage, ServerResponse} from "http";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "../db";
import type {Adapter} from "next-auth/adapters";
import {env} from "../../env/server.mjs";

const commonOptions: Partial<AuthOptions> & { adapter: Adapter } = {
  adapter: PrismaAdapter(prisma),
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
  theme: {
    colorScheme: "dark",
    logo: "https://agentgpt.reworkd.ai/logo-white.svg",
  },
}
export const authOptions = (req: NextApiRequest | IncomingMessage, res: NextApiResponse | ServerResponse) => {
  const options = env.NEXT_PUBLIC_VERCEL_ENV === "development"
    ? devOptions(commonOptions.adapter, req, res)
    : prodOptions

  return merge(commonOptions, options) as AuthOptions
}

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions(ctx.req, ctx.res));
};
