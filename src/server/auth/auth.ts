import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { serverEnv } from "../../env/schema.mjs";
import type {Provider} from "next-auth/providers";
import type {NextAuthOptions} from "next-auth";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/

const getProviders = () => {
  const providers: Provider[] = []

  if (serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: serverEnv.GOOGLE_CLIENT_ID,
        clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    )
  }

  if (serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET) {
    providers.push(
      GithubProvider({
        clientId: serverEnv.GITHUB_CLIENT_ID,
        clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    )
  }

  if (serverEnv.DISCORD_CLIENT_ID && serverEnv.DISCORD_CLIENT_SECRET) {
    providers.push(
      GithubProvider({
        clientId: serverEnv.DISCORD_CLIENT_ID,
        clientSecret: serverEnv.DISCORD_CLIENT_ID,
        allowDangerousEmailAccountLinking: true,
      }),
    )
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: getProviders(),
};

