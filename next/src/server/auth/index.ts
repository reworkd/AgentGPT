import { authOptions as prodOptions } from "./auth";
import { options as devOptions } from "./local-auth";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import merge from "lodash/merge";
import type { IncomingMessage, ServerResponse } from "http";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../db";
import type { Adapter } from "next-auth/adapters";
import { env } from "../../env/server.mjs";

const commonOptions: Partial<AuthOptions> & { adapter: Adapter } = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session.user) session.user.id = user.id;

      session.accessToken = (
        await prisma.session.findFirstOrThrow({
          where: { userId: user.id },
          orderBy: { expires: "desc" },
        })
      ).sessionToken;

      return session;
    },
  },
  theme: {
    colorScheme: "dark",
    logo: "https://agentgpt.reworkd.ai/logo-white.svg",
  },
};
export const authOptions = (
  req: NextApiRequest | IncomingMessage,
  res: NextApiResponse | ServerResponse
) => {
  const options =
    env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? devOptions(commonOptions.adapter, req, res)
      : prodOptions;

  return merge(commonOptions, options) as AuthOptions;
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
  return getServerSession(ctx.req, ctx.res, authOptions(ctx.req, ctx.res));
};
