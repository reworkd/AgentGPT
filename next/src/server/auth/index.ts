import type { IncomingMessage, ServerResponse } from "http";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import merge from "lodash/merge";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type { Adapter } from "next-auth/adapters";

import { authOptions as prodOptions } from "./auth";
import { options as devOptions } from "./local-auth";
import { env } from "../../env/server.mjs";
import { prisma } from "../db";

const commonOptions: Partial<AuthOptions> & { adapter: Adapter } = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const [token, orgs] = await Promise.all([
        prisma.session.findFirstOrThrow({
          where: { userId: user.id },
          orderBy: { expires: "desc" },
        }),
        prisma.organizationUser.findMany({
          where: { user_id: user.id },
          include: { organization: true },
        }),
      ]);

      session.accessToken = token.sessionToken;
      session.user.id = user.id;
      session.user.superAdmin = user.superAdmin;
      session.user.organizations = orgs.map((row) => ({
        id: row.organization.id,
        name: row.organization.name,
        role: row.role,
      }));

      return session;
    },
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
