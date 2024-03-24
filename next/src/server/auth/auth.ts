import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { serverEnv } from "../../env/schema.mjs";


export const authOptions: NextAuthOptions = {
  providers: [
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
  ],
  pages: {
    signIn: "/signin",
  }
};
